import { createServer, Model } from "miragejs";
import Config from "../Config";
import { IPostUserResponse } from "src/interfaces/ResponseInterface";

export function makeServer({ environment = "test" }) {
  const mockServer = createServer({
    environment,
    logging: true,
    timing: 2000,

    models: {
      user: Model,
    },

    seeds(server) {
      server.create("user", {
        id: "123",
      });
    },

    routes() {
      this.urlPrefix = `${Config.apiUri}/v1`;
      this.passthrough();

      // Login
      this.post("/user/login", (schema, request) => {
        const user = schema.db.users.findBy({
          id: "123",
        });
        const body = JSON.parse(request.requestBody);
        const res: IPostUserResponse = {
          user: {
            zid: body.zid,
            isAdmin: false,
            bookmarkedCourses: [],
            bookmarkedReviews: [],
            reports: [],
            reviews: [],
          },
          token: {
            expiresIn: "never",
            token: "token-123",
          },
        };

        schema.db.users.update({ user: user.id }, { ...user, user: res });
        return res;
      });
    },
  });

  return mockServer;
}