const {time} = require('@openzeppelin/test-helpers');
const RFT = artifacts.require('ReFungibleNFT.sol');
const NFT = artifacts.require('NFT.sol');
const DAI = artifacts.require('DAI.sol');
const DAI_AMOUNT = web3.utils.toWei("25000");
const SHARE_AMOUNT = web3.utils.toWei("25000");

contract('RFT', async address => {
    const [admin, buyer1, buyer2, buyer3, buyer4, _] = address;
    it('ICO should work', async () => {
        const dai = await DAI.new();
        const nft = await NFT.new('My awesome NFT', 'NFT');
        await nft.mint(admin, 1);
        await Promise.all([
            dai.mint(buyer1, DAI_AMOUNT),
            dai.mint(buyer2, DAI_AMOUNT),
            dai.mint(buyer3, DAI_AMOUNT),
            dai.mint(buyer4, DAI_AMOUNT),
        ])

        const rft = await RFT.new(
            'My awesome RFT', 'RFT',
            nft.address,
            1,
            1,
            web3.utils.toWei('100000'),
            dai.address
        );

        await nft.approve(rft.address, 1);
        await rft.startIco();

        await dai.approve(rft.address, DAI_AMOUNT, {from: buyer1});
        await rft.buyShare(SHARE_AMOUNT, {from: buyer1})

        await dai.approve(rft.address, DAI_AMOUNT, {from: buyer2});
        await rft.buyShare(SHARE_AMOUNT, {from: buyer2})

        await dai.approve(rft.address, DAI_AMOUNT, {from: buyer3});
        await rft.buyShare(SHARE_AMOUNT, {from: buyer3})

        await dai.approve(rft.address, DAI_AMOUNT, {from: buyer4});
        await rft.buyShare(SHARE_AMOUNT, {from: buyer4})

        await time.increase(7 * 86400 + 1);
        await rft.withDrawProfits();

        const balanceShare = await rft.balanceOf(buyer1);
        const balanceShare2 = await rft.balanceOf(buyer2);
        const balanceShare3 = await rft.balanceOf(buyer3);
        const balanceShare4 = await rft.balanceOf(buyer4);
        assert(balanceShare.toString() === SHARE_AMOUNT);
        assert(balanceShare2.toString() === SHARE_AMOUNT);
        assert(balanceShare3.toString() === SHARE_AMOUNT);
        assert(balanceShare4.toString() === SHARE_AMOUNT);
        const adminBlc = await dai.balanceOf(admin);
        console.log(adminBlc);
        assert(adminBlc.toString() === web3.utils.toWei('100000'))


    })
})
