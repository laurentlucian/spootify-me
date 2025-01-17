import { prisma } from "@lib/services/db.server";
import { SpotifyService } from "@lib/services/sdk/spotify.server";
import { log } from "@lib/utils";
import invariant from "tiny-invariant";

export async function syncUserProfile(userId: string) {
  try {
    log("starting...", "profile");

    const spotify = await SpotifyService.createFromUserId(userId);
    const client = spotify.getClient();
    invariant(client, "spotify client not found");

    const spotifyProfile = await client.getMe();

    const images = spotifyProfile?.body.images;
    const image = images?.[0]?.url || images?.[1]?.url;
    const name = spotifyProfile?.body.display_name;

    await prisma.profile.update({
      where: { id: userId },
      data: {
        image,
        name,
      },
    });

    log("completed", "profile");
    await prisma.sync.upsert({
      create: {
        userId,
        state: "success",
        type: "profile",
      },
      update: {
        state: "success",
      },
      where: {
        userId_type_state: { userId, type: "profile", state: "success" },
      },
    });
  } catch (error: unknown) {
    log("failure", "profile");
    await prisma.sync.upsert({
      create: {
        userId,
        state: "failure",
        type: "profile",
      },
      update: {
        state: "failure",
      },
      where: {
        userId_type_state: { userId, type: "profile", state: "failure" },
      },
    });
    throw error;
  }
}
