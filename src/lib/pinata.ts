import axios from "axios";

const key = process.env.NEXT_PUBLIC_PINATA_KEY as string;
const secret = process.env.NEXT_PUBLIC_PINATA_SECRET as string;

interface UploadResult {
  success: boolean;
  pinataURL?: string;
  message?: string;
  ipfsHash?: string; 
}

function isError(err: unknown): err is Error {
  return typeof err === "object" && err !== null && "message" in err;
}

export const uploadJSONToIPFS = async (
  JSONBody: object
): Promise<UploadResult> => {
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

  try {
    const response = await axios.post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    });

    return {
      success: true,
      ipfsHash: response.data.IpfsHash,
      pinataURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    };
  } catch (error) {
    console.error("Pinata JSON upload error:", error);
    return {
      success: false,
      message: isError(error) ? error.message : "Unknown error",
    };
  }
};

export const uploadFileToIPFS = async (file: File): Promise<UploadResult> => {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const data = new FormData();

  data.append("file", file);

  const metadata = JSON.stringify({
    name: "testname",
    keyvalues: {
      exampleKey: "exampleValue",
    },
  });
  data.append("pinataMetadata", metadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        { id: "FRA1", desiredReplicationCount: 1 },
        { id: "NYC1", desiredReplicationCount: 2 },
      ],
    },
  });
  data.append("pinataOptions", pinataOptions);

  try {
    const response = await axios.post(url, data, {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${
          (data as any)._boundary
        }`,
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    });

    return {
      success: true,
      ipfsHash: response.data.IpfsHash, // ✅ 이 줄이 중요!
      pinataURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    };
  } catch (error) {
    console.error("Pinata file upload error:", error);
    return {
      success: false,
      message: isError(error) ? error.message : "Unknown error",
    };
  }
};

export const fetchMetadataFromIPFS = async (tokenURI: string) => {
  try {
    const metadataUrl = tokenURI.replace(/^ipfs:\/\//, 'https://gateway.pinata.cloud/ipfs/');
    const response = await axios.get(metadataUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching IPFS metadata:', error);
    return null;
  }
};
