import prisma from "../../database/prisma.js";

export async function createRefreshToken(data) {
  return prisma.refreshToken.create({
    data
  });
}

export async function findResreshToken(token) {
  return prisma.refreshToken.findUnique({
    where: { token }
  });
}

export async function deleteRefreshToken(token) {
  return prisma.refreshToken.delete({
    where: { token }
  })
}
