const mariadb = require("mariadb");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { program: optionparser } = require("commander");
const app = express();
const port = 3000;
const { Kafka } = require("kafkajs");

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

let options = optionparser
 .storeOptionsAsProperties(true)
 // Web server
 .option("--port <port>", "Web server port", 3000)
 // Kafka options
 .option(
  "--kafka-broker <host:port>",
  "Kafka bootstrap host:port",
  "my-cluster-kafka-bootstrap:9092"
 )
 .option(
  "--kafka-topic-tracking <topic>",
  "Kafka topic to tracking data send to",
  "tracking-data"
 )
 .option(
  "--kafka-client-id < id > ",
  "Kafka client ID",
  "tracker-" + Math.floor(Math.random() * 100000)
 )
 
 // Database options
 .option("--mariadb-host <host>", "MariaDB host", "big-data-mariadb-service")
 .option("--mariadb-port <port>", "MariaDB port", 3306)
 .option("--mariadb-schema <db>", "MariaDB Schema/database", "popular")
 .option("--mariadb-username <username>", "MariaDB username", "root")
 .option("--mariadb-password <password>", "MariaDB password", "ePddAss2024")
 // Misc
 .addHelpCommand()
 .parse()
 .opts();

// -------------------------------------------------------
// Kafka Configuration
// -------------------------------------------------------

// Kafka connection
const kafka = new Kafka({
 clientId: options.kafkaClientId,
 brokers: [options.kafkaBroker],
 retry: {
  retries: 0,
 },
});

const producer = kafka.producer();
// End

// Send tracking message to Kafka
async function sendTrackingMessage(data) {
 //Ensure the producer is connected
 console.log("Phase0");
 await producer.connect();
 console.log("Phase1");
 //Send message
 let result = await producer.send({
  topic: options.kafkaTopicTracking,
  messages: [{ value: JSON.stringify(data) }],
 });
 console.log("Phase2");

 console.log("Send result:", result);
 return result;
}
// End

// -------------------------------------------------------
// Database Configuration
// -------------------------------------------------------

const pool = mariadb.createPool({
 host: options.mariadbHost,
 port: options.mariadbPort,
 database: options.mariadbSchema,
 user: options.mariadbUsername,
 password: options.mariadbPassword,
 connectionLimit: 5,
});
//const pool = mariadb.createPool({
// host: 'big-data-mariadb-service',
// user: 'root',
// password: 'ePddAss2024',
// database: 'Demo',
// connectionLimit: 5
//});

async function connect() {
 let conn;
 try {
  conn = await pool.getConnection();
  console.log("Connected to MariaDB!");
  await conn.query(`CREATE TABLE IF NOT EXISTS logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product VARCHAR(255) NOT NULL,
      timestamp DATETIME NOT NULL
    );`);
  console.log("Table 'logs' is ready");
 } catch (err) {
  console.error("Error connecting to MariaDB:", err);
 } finally {
  if (conn) conn.end();
 }
}

app.post("/logClick", async (req, res) => {
 console.log("Klappt");
 const product = req.body.product;
 console.log("Empfangener Produktklick:", product);
 console.log(result);
});

function sendResponse(res, html) {
 res.send(`<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Produkt 1</title>
    <link rel="stylesheet" href="produkt.css">
</head>
<body>
    <header>
        <h1>Produkt 1</h1>
	${html}
    </header>
    <div class="container">
        <div class="content">
            <div class="text">
                <h2>Produkt 1</h2>
                <p>Der Spätburgunder, auch als Pinot Noir bekannt, ist eine der bedeutendsten und qualitativ hochwertigsten Rotweinsorten. Ursprünglich aus Burgund stammend, hat sich die Rebsorte seit den 1990er Jahren auch in Deutschland etabliert, mit Hauptanbaugebieten in Baden und Rheinhessen. Dieser Edelwein erfordert viel Sorgfalt und optimale Bedingungen, um sein volles Potenzial zu entfalten. Spätburgunder-Weine sind meist trocken, samtig und fruchtig im Aroma, und werden oft in Barriquefässern ausgebaut. Die Rebsorte kann auch für die Herstellung von Roséweinen, Sekten und dem besonderen "Blanc des Noirs" verwendet werden.</p>
                <a href="index.html">Zurück zur Startseite</a>
            </div>
        </div>
    </div>
    <footer>
        <p>&copy; 2024 Unsere Produktseite</p>
    </footer>
</body>
</html>	`);
}

function sendAdminResponse(res, html) {
    res.send(`	
    <!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>

    <script>
        
    </script>

</head>
<body>

    ${html}

    <header>
        <h1>Admin Dashboard</h1>
    </header>
    <div class="container">
        <h2>Logs</h2>
        <table id="logs-table">
            <thead>
                <tr>
                    <th>Produkt</th>
                    <th>Zeit</th>
                </tr>
            </thead>
            <tbody id="logs">
                <!-- Logs werden hier eingefügt -->
            </tbody>
        </table>
    </div>
    <footer>
        <p>&copy; 2024 Admin Dashboard</p>
    </footer>
</body>
</html>
    `);
}

async function getLogs() {
    conn = await pool.getConnection();
		const data = await conn.query("SELECT * FROM logs")
		if (data) {        
			let result = data.map(row => row?.[0])
			console.log("Got result=", result, "storing in cache")
			return result
		} else {
			throw "No missions data found"
		}
	}


app.get("/admin" ,  (req, res) => {
 
Promise.all(getLogs()).then((values) => {
    const Logs = values [0]

    const logsHtml = Logs.result
     .map((m) => `<p> ${m} </p>`)
     .join(", ");
    sendAdminResponse(res,logsHtml)
 }
)


sendAdminResponse(res, "<h1>helloworld</h1>");
 
}
)




app.get("/wein/:weinen", (req, res) => {
 let wein = req.params["weinen"];

 console.log("DAs ist Wein:", wein);
 sendTrackingMessage({
  wein: wein,
  timestamp: Math.floor(new Date() / 1000),
 }).then(() => console.log("Successful"));
 sendResponse(res, "<h1>helloworld</h1>");
});

app.listen(port, () => {
 console.log(`Server läuft`);
});
sendTrackingMessage("test");
connect();
//
//async function wait() {
// const consumer = kafka.consumer({ groupId: "my-group" });
// await consumer.connect();
// await consumer.subscribe({ topics: ["tracking-data"] });
// await consumer.run({
//  eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
//   console.log({
//    key: message.key.toString(),
//    value: message.value.toString(),
//    headers: message.headers,
//   });
//  },
// });
//}
//wait();
