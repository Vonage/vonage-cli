import { promises as fs } from 'fs';

export const appFileData =
{
    application_name: "Test App File",
    application_id: '1234-5678-abcd-efgh',
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQChMtZvvTVZltzi\nuv94cEW/McbLhiJCRvK+26o50JP4CDHtIiidrQiy1A6PdhXHXq7q+jYo9yrm9+mm\ngmYtTAtZ7ZVRDVOwuXoT71HXcFoRLedORx3Yp4J165uPO506nDvjvcURWLbLfCst\nsc2X189C31rCc4dPrmFkUoqtNWAoLsAjZJP7JfoGXR0V2mPeDwfWHqIlA+RgQ5ne\nc47CPWDxRVw9VKLre2BWX33N6iZ3fXkd/xobdTA/xjosGBz6sUIxnQSaW6YvLjZI\nJtNm5MfLehDGXXT3rmqOuxYLEHruibsrvGv/gxjnGEfa2JT38JRRU5rZCQoXeeXG\nhYm6zCExAgMBAAECggEAJUR7Fg9A18sMmzCPYplWTqsj4ibLIdaERYLEeqRRqUy/\nuiqlCDsaYTmsehdbVqH5v6KERflKxmY3cwL/u2Yy06IdXMU/fYKMCjLQkYXMlN8v\ndEX1zQKBI2EKsFUgdw3qvK7Bck63yBiXZPOP7BR9OuEnewA5nr7ajlaU8BGAfxld\n7AmCnkBUtdHNTVWm4Wzk2Uzn5BPHUQyLW/KT5/FSIfVVGodQUc+O9fegs/aNY86A\ndafnKvNKtZBT2hwnRXqNK4jTAgKGYtiT4OJ/sa6ob5gylwXYbYGz8QvEdULsnuQM\np7I0Z0q91ZQ2jggqU7DPLuVTEJEWG4VYNbeGaJYDjwKBgQDNMcsL6/OjDUc//imG\nyjuvftSzLteCiaFP+my6Lo8GCXsffKApqvEukWtD8WP2jhv1I8KuqRDfT9F1gW4V\nhhNulN72ugoEjRO2kkxK/KynAQwAsyVkAsWc3/t86kEiMg67GI7aV8fLGIlJQ1IL\nykVZyVsaQPBV5bTscj+yXTp2DwKBgQDJHF+GW11f4hKklN2kkUHIAOL/6sQEbFoV\nxm0Jb4uMS9T3Ge0AeAUbvIv3XZjTcS86fnmaaWu2w3w1R5gjZA+4W4hGAfMouBPQ\nDTMeCwEWWmpgWCW8IfowuQ0tGDQTAEXaZISOceyAxK6azMUFC6emGJ4M12Ls1iSk\nzCESy500vwKBgAckSYXjs3okVyuCBB394e/swShvY+7WLXgkJi6gujeiktd4tfZd\nTcGqLAqUVz9YmN6CXR9JIR40n/ywAY3cOcbqhYwe04RvCJWdJ+ygOL4jSjCoC5Ac\njJY2MYGagaPYDC004Jv23CxUcUrMfgmNA7bpTDNwuSy0LwTfwRnLJuK/AoGBAIRd\nFkoZzCUVaGvGRvLPX9pBKyaA366BmfEG/jDdp50ZM/vGpoROeh49RGn0wmc38Xuw\nTlzg0bIii5eNnYZ9jxMpu1FIaz/7l56xcVluqLKLo8PxgDSIsGBtC00Ixw1Seqc4\nzT3roVtHGBxudaXSe+8H+M4+3K9AajHE4Ge8d6WFAoGBAMdt51EUcp5P9qR/4sa2\npSlL8C4SQKHJVVWu/miwcEx+mSlDgr+sCQJGmxyN5Ojf0salEOWxbIMveDKdrp38\nAU0Rmg0yVs7FXAxlOBcK0BOiUf8MhPBr9+uDh6X4wr2bSxdac3vSQUGFeA9CIWH7\nSI3z3A9Lp1aRaLucxTlJGq22\n-----END PRIVATE KEY-----\n"
}

export async function mochaGlobalSetup() {
    try {
        await fs.writeFile('vonage_app.json', JSON.stringify(appFileData, null, 2));
        console.log("Temp app file created");
    } catch (error) {
        console.error(error)
    }

    // set up prism
}

export async function mochaGlobalTeardown() {
    try {
        await fs.unlink('vonage_app.json');
        console.log("Temp app file deleted");
    } catch (error) {
        console.error(error)
    }
}