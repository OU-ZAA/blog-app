import { omit } from "lodash";
import userModel, { userDocument } from "../models/user.model";
import { FilterQuery, ObtainDocumentType } from "mongoose";

export async function createUser(
  input: ObtainDocumentType<
    Omit<userDocument, "createdAt" | "updateAt" | "comparePassowd">
  >
) {
  try {
    const user = await userModel.create(input);
    return omit(user.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await userModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), "password");
}

export async function findUser(query: FilterQuery<userDocument>) {
  return userModel.findOne(query).lean();
}