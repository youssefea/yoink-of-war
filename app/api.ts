import fetch from "node-fetch";

const URL =
  process.env.ENVIRONMENT === "local"
    ? process.env.LOCALHOST
    : process.env.PROD_URL;

const tokenAddress = process.env.SUPER_TOKEN_ADDRESS as `0x${string}`;

export const followingQuery = (id) => `
query isFollowing {
  Wallet(input: {identity: "fc_fid:${id}", blockchain: ethereum}) {
    socialFollowers(input: {filter: {identity: {_in: ["fc_fid:${process.env.FID}"]}}}) {
      Follower {
        dappName
        dappSlug
        followingProfileId
        followerProfileId
        followerAddress {
          socials(input: {filter: {dappName: {_eq: farcaster}}}) {
            profileHandle
            profileName
            dappName
          }
        }
      }
    }
  }
}
`;

export const walletQuery = (id) => `
query GetAddressesOfFarcasters {
  Socials(input: {filter: {userId: {_eq: "${id}"}}, blockchain: ethereum}) {
    Social {
      userAssociatedAddresses
    }
  }
}
`;

export const profileQuery = (id) => `
query GetAddressesOfFarcasters {
  Socials(input: {filter: {profileName: {_eq: "${id}"}}, blockchain: ethereum}) {
    Social {
      userAssociatedAddresses
    }
  }
}
`;

export const profileQueryLens = (id) => `
query GetAddressesOfFarcasters {
  Socials(
    input: {filter: {profileName: {_eq: "lens/${id}"}}, blockchain: ethereum}
  ) {
    Social {
      userAssociatedAddresses
    }
  }
}
`;
export const validateMessageQuery = (messageBytes) => `
query MyQuery(
  $messageBytes: String!
) {
  FarcasterValidateFrameMessage(
    input: {filter: {messageBytes: "${messageBytes}"}
  ) {
    isValid
    message {
      data {
        fid
        frameActionBody {
          buttonIndex
          castId {
            fid
            hash
          }
          inputText
          state
        }
      }
    }
    interactedByFid
    interactedBy {
      profileName
    }
    castedByFid
    castedBy {
      profileName
    }
  }
}`;




export const numberOfFollowersQuery = (profileId) => `
query FollowerCount {
  Socials(
    input: {filter: {dappName: {_eq: farcaster}, profileName: {_eq: "${profileId}"}}, blockchain: ethereum}
  ) {
    Social {
      followerCount
    }
  }
}
`;

export const getUserHandleQuery= (fid) => `
query getUserHandle {
  Socials(
    input: {filter: {dappName: {_eq: farcaster}, userId: {_eq: "${fid}"}}, blockchain: ethereum}
  ) {
    Social {
      profileHandle
    }
  }
}
`;

export const getFidFromHandleQuery = (handle) => `
query FidFromUsername {
  Socials(
    input: {filter: {dappName: {_eq: farcaster}, profileName: {_eq: "${handle}"}}, blockchain: ethereum}
  ) {
    Social {
      userId
    }
  }`;

// Function to perform the POST request and handle the response
export async function fetchSubgraphData(myQuery) {
  const requestData = {
    query: myQuery,
  };

  try {
    const response = await fetch(
      "https://base-mainnet.subgraph.x.superfluid.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
    throw error; // Rethrow or handle as needed
  }
}

// sender.ts - Example of sending data from another TypeScript file
// Use this line if you're in Node.js and have installed node-fetch

export async function updateProfileData(
  profileHandle: string,
  address: string
) {
  const url = `${URL}/currentYoinkerPost`; // Replace with your actual API endpoint
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profileHandle, address }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function updateTimestampData(
  profileHandle: string,
  timestamp: number
) {
  const url = `${URL}/yoinkerLastTimeStampPost`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profileHandle, timestamp }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getTimestampData(profileHandle: string) {
  const url = `${URL}/yoinkerLastTimestamp`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profileHandle }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Success:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}