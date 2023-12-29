import axios from "axios";

module.exports = async (req, res) => {
    try {
        const response = await axios.post(
            'https://webservices.amazon.in/paapi5/getitems',
            {
                'ItemIds': [
                    'B09G9FPGTN'
                ],
                'Resources': [
                    'BrowseNodeInfo.BrowseNodes',
                    'BrowseNodeInfo.BrowseNodes.Ancestor',
                    'BrowseNodeInfo.BrowseNodes.SalesRank',
                    'BrowseNodeInfo.WebsiteSalesRank',
                    'Images.Primary.Small',
                    'Images.Primary.Large',
                    'ItemInfo.ByLineInfo',
                    'ItemInfo.ContentInfo',
                    'ItemInfo.ContentRating',
                    'ItemInfo.Classifications',
                    'ItemInfo.ExternalIds',
                    'ItemInfo.Features',
                    'ItemInfo.ManufactureInfo',
                    'ItemInfo.ProductInfo',
                    'ItemInfo.TechnicalInfo',
                    'ItemInfo.Title',
                    'ItemInfo.TradeInInfo'
                ],
                'PartnerTag': 'catchkaps0e-21',
                'PartnerType': 'Associates',
                'Marketplace': 'www.amazon.in'
            },
            {
                headers: {
                    // Add any required headers for authentication
                    'Authorization': 'AWS4-HMAC-SHA256 Credential=AKIAI46JMULHWNX6X66A/20231229/eu-west-1/ProductAdvertisingAPI/aws4_request SignedHeaders=content-encoding;host;x-amz-date;x-amz-target  Signature=ef460e09ad2fc4c529437a13cec6878617ac132d79edd5088efb8df8b0fcbab2'
                },
            });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};