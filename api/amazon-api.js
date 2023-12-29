import axios from "axios";

module.exports = async (req, res) => {
    try {
        const response = await axios.post(
            'https://webservices.amazon.in/!YW16LTEuMDtjb20uYW1hem9uLnBhYXBpNS52MS5Qcm9kdWN0QWR2ZXJ0aXNpbmdBUEl2MS5HZXRJdGVtczt7CiAgICAiSXRlbUlkcyI6IFsKICAgICAgICAiQjA5RzlGUEdUTiIKICAgIF0sCiAgICAiUmVzb3VyY2VzIjogWwogICAgICAgICJCcm93c2VOb2RlSW5mby5Ccm93c2VOb2RlcyIsCiAgICAgICAgIkJyb3dzZU5vZGVJbmZvLkJyb3dzZU5vZGVzLkFuY2VzdG9yIiwKICAgICAgICAiQnJvd3NlTm9kZUluZm8uQnJvd3NlTm9kZXMuU2FsZXNSYW5rIiwKICAgICAgICAiQnJvd3NlTm9kZUluZm8uV2Vic2l0ZVNhbGVzUmFuayIsCiAgICAgICAgIkltYWdlcy5QcmltYXJ5LlNtYWxsIiwKICAgICAgICAiSW1hZ2VzLlByaW1hcnkuTGFyZ2UiLAogICAgICAgICJJdGVtSW5mby5CeUxpbmVJbmZvIiwKICAgICAgICAiSXRlbUluZm8uQ29udGVudEluZm8iLAogICAgICAgICJJdGVtSW5mby5Db250ZW50UmF0aW5nIiwKICAgICAgICAiSXRlbUluZm8uQ2xhc3NpZmljYXRpb25zIiwKICAgICAgICAiSXRlbUluZm8uRXh0ZXJuYWxJZHMiLAogICAgICAgICJJdGVtSW5mby5GZWF0dXJlcyIsCiAgICAgICAgIkl0ZW1JbmZvLk1hbnVmYWN0dXJlSW5mbyIsCiAgICAgICAgIkl0ZW1JbmZvLlByb2R1Y3RJbmZvIiwKICAgICAgICAiSXRlbUluZm8uVGVjaG5pY2FsSW5mbyIsCiAgICAgICAgIkl0ZW1JbmZvLlRpdGxlIiwKICAgICAgICAiSXRlbUluZm8uVHJhZGVJbkluZm8iCiAgICBdLAogICAgIlBhcnRuZXJUYWciOiAiY2F0Y2hrYXBzMGUtMjEiLAogICAgIlBhcnRuZXJUeXBlIjogIkFzc29jaWF0ZXMiLAogICAgIk1hcmtldHBsYWNlIjogInd3dy5hbWF6b24uaW4iCn0=',
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
                    'Host': 'webservices.amazon.in',
                    'Accept': 'application/json, text/javascript',
                    'Accept-Language': 'en-US',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Amz-Date': '20231229T135724Z',
                    'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems',
                    'Content-Encoding': 'amz-1.0',
                    'Authorization': 'AWS4-HMAC-SHA256 Credential=AKIAI46JMULHWNX6X66A/20231229/eu-west-1/ProductAdvertisingAPI/aws4_request SignedHeaders=content-encoding;host;x-amz-date;x-amz-target  Signature=ef460e09ad2fc4c529437a13cec6878617ac132d79edd5088efb8df8b0fcbab2'
                },
            });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};