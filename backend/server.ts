import express, { Express, Request, Response } from "express";
import cors from "cors";
// import * as path from "path";
import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";

dotenv.config();

// import * as url from "url";
// const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// const buildPath = path.join(__dirname, "../dist");
const app: Express = express();
const port = 5002;

// app.use(express.static(buildPath));
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

// gets the static files from the build folder
// app.get("*", (req, res) => {
//   res.sendFile(path.join(buildPath, "index.html"));
// });

app.post("/", (req: Request, res: Response) => {
  res.send("hello");
});

app.post("/test", (req: Request, res: Response) => {
  const requestData = req.body.prompt;
  console.log(requestData);
  const response = JSON.parse('{"name":"John", "age":30, "city":"New York"}');
  res.send(response);
});

app.post("/sketch", async (req: Request, res: Response) => {
  const prompt = req.body.prompt;
  console.log(`Received prompt: ${prompt}`);
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert web developer.
            Your job is to convert a natural language description of a user interface and turn it into valid HTML. 
            Only use vanilla HTML and CSS. Don't include any image URLs. Only return valid HTML without any extra explanation.`,
        },
        // {
        //   role: "user",
        //   // content: `Turn the following prompt into HTML: "${prompt}". Respond with an HTML object in this specific format: "<div style={{height: "300px", width: "300px", backgroundColor: "purple", borderRadius: "50%"}}></div>". FOLLOW THE CURLY BRACES. DO NOT OUPUT ANY TEXT.`,
        //   content: "a round purple circle",
        // },
        // {
        //   role: "assistant",
        //   content: `<div style="height:300px;width:300px;background-color:purple;border-radius:50%"></div>`,
        // },
        {
          role: "user",
          content: `${prompt}`,
        },
      ],
    });
    res.send(completion.data.choices[0].message);
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
});
