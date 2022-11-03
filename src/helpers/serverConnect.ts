import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const con = new HubConnectionBuilder()
  .withUrl("https://localhost:5000/tournament-hub", {
    accessTokenFactory: () => "dDjrdqUJdGGHgYD6G-sKcA",
  })
  .configureLogging(LogLevel.Information)
  .build();

function startConnection() {
  con.start();
}

export { con, startConnection };
