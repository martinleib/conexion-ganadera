import { NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function POST(req) {
  try {
    const { nombre, identificador } = await req.json();

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: "damnificados.json",
    };

    const data = await s3.getObject(params).promise();
    const damnificados = JSON.parse(data.Body.toString("utf-8"));

    let filteredDamnificados = damnificados;

    if (identificador) {
      filteredDamnificados = filteredDamnificados.filter(
        (damnificado) => damnificado.dador == identificador
      );
    }

    if (nombre) {
      filteredDamnificados = filteredDamnificados.filter((damnificado) =>
        damnificado.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
    }

    return NextResponse.json(filteredDamnificados);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
