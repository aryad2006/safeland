const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("SafeLandEscrow", function () {
  let nft, escrow;
  let admin, agent, notary, dgi, ancfcc, seller, buyer;

  const AGENT_ROLE = ethers.keccak256(ethers.toUtf8Bytes("AGENT_ROLE"));
  const NOTARY_ROLE = ethers.keccak256(ethers.toUtf8Bytes("NOTARY_ROLE"));
  const JUSTICE_ROLE = ethers.keccak256(ethers.toUtf8Bytes("JUSTICE_ROLE"));

  const SALE_PRICE = ethers.parseEther("10"); // 10 ETH (simule MAD)

  beforeEach(async function () {
    [admin, agent, notary, dgi, ancfcc, seller, buyer] = await ethers.getSigners();

    // Déployer SafeLandNFT
    const SafeLandNFT = await ethers.getContractFactory("SafeLandNFT");
    nft = await upgrades.deployProxy(SafeLandNFT, [admin.address], { initializer: "initialize" });
    await nft.waitForDeployment();

    const nftAddress = await nft.getAddress();

    // Déployer SafeLandEscrow
    const SafeLandEscrow = await ethers.getContractFactory("SafeLandEscrow");
    escrow = await upgrades.deployProxy(
      SafeLandEscrow,
      [admin.address, nftAddress, dgi.address, ancfcc.address],
      { initializer: "initialize" }
    );
    await escrow.waitForDeployment();

    const escrowAddress = await escrow.getAddress();

    // Configurer les rôles
    await nft.connect(admin).grantRole(AGENT_ROLE, agent.address);
    await nft.connect(admin).grantRole(AGENT_ROLE, escrowAddress); // L'escrow peut transférer
    await nft.connect(admin).grantRole(NOTARY_ROLE, notary.address);
    await escrow.connect(admin).grantRole(NOTARY_ROLE, notary.address);

    // Créer une propriété pour le vendeur
    const docHash = ethers.keccak256(ethers.toUtf8Bytes("titre-vente"));
    await nft.connect(agent).createProperty(
      seller.address, "VENTE/001", "villa", 300,
      "Casablanca", "Maarif", 33573100, -7589800,
      "ipfs://QmSeller", docHash
    );
  });

  describe("Flux de vente complet", function () {
    it("devrait exécuter une vente avec fractionnement fiscal", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat-vente"));

      // 1. Le notaire crée le deal
      await escrow.connect(notary).createDeal(
        1, seller.address, buyer.address, SALE_PRICE, docHash
      );

      const deal = await escrow.getDeal(1);
      expect(deal.seller).to.equal(seller.address);
      expect(deal.buyer).to.equal(buyer.address);

      // 2. Le vendeur signe
      await escrow.connect(seller).sellerSign(1);

      // 3. L'acheteur dépose les fonds
      await escrow.connect(buyer).buyerDeposit(1, { value: SALE_PRICE });

      // Capturer les soldes avant
      const dgiBefore = await ethers.provider.getBalance(dgi.address);
      const ancfccBefore = await ethers.provider.getBalance(ancfcc.address);
      const sellerBefore = await ethers.provider.getBalance(seller.address);

      // 4. Le notaire complète la transaction
      await escrow.connect(notary).notaryComplete(1);

      // Vérifier le fractionnement fiscal
      const dgiAfter = await ethers.provider.getBalance(dgi.address);
      const ancfccAfter = await ethers.provider.getBalance(ancfcc.address);
      const sellerAfter = await ethers.provider.getBalance(seller.address);

      const dgiReceived = dgiAfter - dgiBefore;
      const ancfccReceived = ancfccAfter - ancfccBefore;
      const sellerReceived = sellerAfter - sellerBefore;

      // 4% DGI
      expect(dgiReceived).to.equal((SALE_PRICE * 400n) / 10000n);
      // 1% ANCFCC
      expect(ancfccReceived).to.equal((SALE_PRICE * 100n) / 10000n);
      // 95% vendeur
      expect(sellerReceived).to.equal(SALE_PRICE - dgiReceived - ancfccReceived);

      // Le NFT appartient maintenant à l'acheteur
      expect(await nft.ownerOf(1)).to.equal(buyer.address);

      // Le deal est complété
      const finalDeal = await escrow.getDeal(1);
      expect(finalDeal.status).to.equal(4); // Completed
    });
  });

  describe("Annulation", function () {
    it("devrait rembourser l'acheteur en cas d'annulation", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      await escrow.connect(seller).sellerSign(1);
      await escrow.connect(buyer).buyerDeposit(1, { value: SALE_PRICE });

      const buyerBefore = await ethers.provider.getBalance(buyer.address);
      await escrow.connect(notary).cancelDeal(1, "litige");
      const buyerAfter = await ethers.provider.getBalance(buyer.address);

      expect(buyerAfter - buyerBefore).to.equal(SALE_PRICE);
      expect(await nft.ownerOf(1)).to.equal(seller.address); // NFT non transféré
    });
  });

  describe("Sécurité", function () {
    it("devrait refuser un montant incorrect", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      await escrow.connect(seller).sellerSign(1);

      await expect(
        escrow.connect(buyer).buyerDeposit(1, { value: ethers.parseEther("5") })
      ).to.be.revertedWith("Escrow: wrong amount");
    });

    it("devrait refuser un double deal sur le même token", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);

      await expect(
        escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash)
      ).to.be.revertedWith("Escrow: deal already active");
    });
  });

  describe("Couverture branches supplémentaires", function () {
    it("devrait retourner le totalDeals", async function () {
      expect(await escrow.totalDeals()).to.equal(0);
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      expect(await escrow.totalDeals()).to.equal(1);
    });

    it("devrait retourner le deal actif par tokenId", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      expect(await escrow.getActiveDeal(1)).to.equal(1);
    });

    it("devrait permettre au admin de changer le wallet DGI", async function () {
      await escrow.connect(admin).setDgiWallet(buyer.address);
      expect(await escrow.dgiWallet()).to.equal(buyer.address);
    });

    it("devrait refuser setDgiWallet avec address(0)", async function () {
      await expect(
        escrow.connect(admin).setDgiWallet(ethers.ZeroAddress)
      ).to.be.revertedWith("Escrow: zero address");
    });

    it("devrait permettre au admin de changer le wallet ANCFCC", async function () {
      await escrow.connect(admin).setAncfccWallet(buyer.address);
      expect(await escrow.ancfccWallet()).to.equal(buyer.address);
    });

    it("devrait refuser setAncfccWallet avec address(0)", async function () {
      await expect(
        escrow.connect(admin).setAncfccWallet(ethers.ZeroAddress)
      ).to.be.revertedWith("Escrow: zero address");
    });

    it("devrait permettre pause/unpause par admin", async function () {
      await escrow.connect(admin).pause();
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await expect(
        escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash)
      ).to.be.reverted;

      await escrow.connect(admin).unpause();
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      expect(await escrow.totalDeals()).to.equal(1);
    });

    it("devrait permettre au admin d annuler un deal", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      await escrow.connect(admin).cancelDeal(1, "admin_cancel");
      const deal = await escrow.getDeal(1);
      expect(deal.status).to.equal(5); // Cancelled
    });

    it("devrait annuler un deal sans fonds deposés", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      // Annuler avant tout dépôt
      await escrow.connect(notary).cancelDeal(1, "no_deposit_cancel");
      const deal = await escrow.getDeal(1);
      expect(deal.status).to.equal(5); // Cancelled
    });

    it("devrait supporter l upgrade UUPS", async function () {
      const EscrowV2 = await ethers.getContractFactory("SafeLandEscrow");
      const upgraded = await upgrades.upgradeProxy(await escrow.getAddress(), EscrowV2);
      expect(await upgraded.totalDeals()).to.equal(0);
    });

    it("devrait refuser un non-notaire de creer un deal", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await expect(
        escrow.connect(buyer).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash)
      ).to.be.reverted;
    });

    it("devrait refuser sellerSign par un non-vendeur", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      await expect(
        escrow.connect(buyer).sellerSign(1)
      ).to.be.revertedWith("Escrow: not seller");
    });

    it("devrait refuser buyerDeposit par un non-acheteur", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      await escrow.connect(seller).sellerSign(1);
      await expect(
        escrow.connect(seller).buyerDeposit(1, { value: SALE_PRICE })
      ).to.be.revertedWith("Escrow: not buyer");
    });

    // ─── Branches initialize ──────────────────────────────
    it("devrait refuser initialize avec nftContract zero", async function () {
      const SafeLandEscrow = await ethers.getContractFactory("SafeLandEscrow");
      await expect(
        upgrades.deployProxy(
          SafeLandEscrow,
          [admin.address, ethers.ZeroAddress, dgi.address, ancfcc.address],
          { initializer: "initialize" }
        )
      ).to.be.revertedWith("Escrow: zero NFT address");
    });

    it("devrait refuser initialize avec dgiWallet zero", async function () {
      const nftAddress = await nft.getAddress();
      const SafeLandEscrow = await ethers.getContractFactory("SafeLandEscrow");
      await expect(
        upgrades.deployProxy(
          SafeLandEscrow,
          [admin.address, nftAddress, ethers.ZeroAddress, ancfcc.address],
          { initializer: "initialize" }
        )
      ).to.be.revertedWith("Escrow: zero DGI address");
    });

    it("devrait refuser initialize avec ancfccWallet zero", async function () {
      const nftAddress = await nft.getAddress();
      const SafeLandEscrow = await ethers.getContractFactory("SafeLandEscrow");
      await expect(
        upgrades.deployProxy(
          SafeLandEscrow,
          [admin.address, nftAddress, dgi.address, ethers.ZeroAddress],
          { initializer: "initialize" }
        )
      ).to.be.revertedWith("Escrow: zero ANCFCC address");
    });

    // ─── Branches createDeal ──────────────────────────────
    it("devrait refuser createDeal si seller n est pas ownerOf", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await expect(
        escrow.connect(notary).createDeal(1, buyer.address, seller.address, SALE_PRICE, docHash)
      ).to.be.revertedWith("Escrow: not owner");
    });

    it("devrait refuser createDeal si token non transférable", async function () {
      // Verrouiller le token
      await nft.connect(seller).lockTransfer(1, "test_lock");
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await expect(
        escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash)
      ).to.be.revertedWith("Escrow: token not transferable");
    });

    it("devrait refuser createDeal avec prix zero", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await expect(
        escrow.connect(notary).createDeal(1, seller.address, buyer.address, 0, docHash)
      ).to.be.revertedWith("Escrow: zero price");
    });

    // ─── Branches sellerSign ──────────────────────────────
    it("devrait refuser sellerSign si mauvais status", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      await escrow.connect(seller).sellerSign(1);
      // Maintenant le status est SellerSigned, pas Created
      await expect(
        escrow.connect(seller).sellerSign(1)
      ).to.be.revertedWith("Escrow: wrong status");
    });

    // ─── Branches buyerDeposit ────────────────────────────
    it("devrait refuser buyerDeposit si seller n a pas signé", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      await expect(
        escrow.connect(buyer).buyerDeposit(1, { value: SALE_PRICE })
      ).to.be.revertedWith("Escrow: seller must sign first");
    });

    // ─── Branches notaryComplete ──────────────────────────
    it("devrait refuser notaryComplete si pas funded", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      await escrow.connect(seller).sellerSign(1);
      await expect(
        escrow.connect(notary).notaryComplete(1)
      ).to.be.revertedWith("Escrow: not funded");
    });

    it("devrait refuser notaryComplete par un autre notaire", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      await escrow.connect(seller).sellerSign(1);
      await escrow.connect(buyer).buyerDeposit(1, { value: SALE_PRICE });

      // Créer un 2e notaire
      const [,,,,,,, notary2] = await ethers.getSigners();
      await escrow.connect(admin).grantRole(NOTARY_ROLE, notary2.address);
      await expect(
        escrow.connect(notary2).notaryComplete(1)
      ).to.be.revertedWith("Escrow: not assigned notary");
    });

    it("devrait refuser notaryComplete quand en pause", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      await escrow.connect(seller).sellerSign(1);
      await escrow.connect(buyer).buyerDeposit(1, { value: SALE_PRICE });
      await escrow.connect(admin).pause();
      await expect(
        escrow.connect(notary).notaryComplete(1)
      ).to.be.reverted;
    });

    // ─── Branches cancelDeal ──────────────────────────────
    it("devrait refuser cancelDeal par un non-autorisé", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      await expect(
        escrow.connect(buyer).cancelDeal(1, "unauthorized")
      ).to.be.revertedWith("Escrow: not authorized");
    });

    it("devrait refuser cancelDeal si déjà completed", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      await escrow.connect(seller).sellerSign(1);
      await escrow.connect(buyer).buyerDeposit(1, { value: SALE_PRICE });
      await escrow.connect(notary).notaryComplete(1);
      await expect(
        escrow.connect(notary).cancelDeal(1, "too late")
      ).to.be.revertedWith("Escrow: already completed");
    });

    // ─── Branches setWallet sans rôle ─────────────────────
    it("devrait refuser setDgiWallet par un non-admin", async function () {
      await expect(
        escrow.connect(buyer).setDgiWallet(buyer.address)
      ).to.be.reverted;
    });

    it("devrait refuser setAncfccWallet par un non-admin", async function () {
      await expect(
        escrow.connect(buyer).setAncfccWallet(buyer.address)
      ).to.be.reverted;
    });

    // ─── Branches cancel seller avant funding ─────────────
    it("devrait permettre au seller d annuler via notaire avant funding", async function () {
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("contrat"));
      await escrow.connect(notary).createDeal(1, seller.address, buyer.address, SALE_PRICE, docHash);
      await escrow.connect(seller).sellerSign(1);
      // Cancel après signature mais avant dépôt → pas de refund needed
      await escrow.connect(notary).cancelDeal(1, "seller_changed_mind");
      const deal = await escrow.getDeal(1);
      expect(deal.status).to.equal(5); // Cancelled
    });
  });
});
