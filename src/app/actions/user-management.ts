
'use server';

import { clerkClient } from '@clerk/nextjs/server';


export async function getUserById(id: string) {
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(id);
  console.log("user below:")
  console.log(user);
  
  // Return only serializable data
  return {
    id: user.id,
    emailAddresses: user.emailAddresses.map(email => ({
      id: email.id,
      emailAddress: email.emailAddress,
      verification: {
        status: email.verification?.status,
        strategy: email.verification?.strategy,
        externalVerificationRedirectURL: email.verification?.externalVerificationRedirectURL,
        attempts: email.verification?.attempts,
        expireAt: email.verification?.expireAt,
        nonce: email.verification?.nonce,
        message: email.verification?.message
      }
    })),
    publicMetadata: user.publicMetadata,
    privateMetadata: user.privateMetadata,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    imageUrl: user.imageUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}


export async function updateUserMetadata(id: string, data: {
  tier: 'free' | 'silver' | 'gold' | 'platinum',
  role: 'admin' | 'user'
}) {
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(id, {
    publicMetadata: {
      tier: data.tier,
      role: data.role
    }
  });
}

export async function deleteUser(id: string) {
  const clerk = await clerkClient();
  await clerk.users.deleteUser(id);
}


export async function getAllUsers() {
  const clerk = await clerkClient();
  const response = await clerk.users.getUserList({ limit: 100 });
  
  // Return only serializable data for each user
  return response.data.map((user: any) => ({
    id: user.id,
    emailAddresses: user.emailAddresses.map((email: any) => ({
      id: email.id,
      emailAddress: email.emailAddress,
      verification: {
        status: email.verification?.status,
        strategy: email.verification?.strategy,
        externalVerificationRedirectURL: email.verification?.externalVerificationRedirectURL,
        attempts: email.verification?.attempts,
        expireAt: email.verification?.expireAt,
        nonce: email.verification?.nonce,
        message: email.verification?.message
      }
    })),
    publicMetadata: user.publicMetadata,
    privateMetadata: user.privateMetadata,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    imageUrl: user.imageUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }));
}


