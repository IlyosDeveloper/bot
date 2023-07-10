import { Bot } from "grammy";
import axios from "axios";
import regions from "./regions.js";
import * as cheerio from "cheerio";
import days from "./days.js";
import months from "./months.js";
import dotenv from "dotenv"
dotenv.config()

const bot = new Bot(process.env.TOKEN);
const allRegions = [
  regions.map((reg) => ({ text: reg.name, callback_data: reg.id })),
];

bot.command("start", (ctx) => {
  ctx.reply(
    `Assalomu alaykum ${ctx.message.from.first_name} Hududni tanlang !`,
    {
      reply_markup: {
        inline_keyboard: allRegions,
      },
    }
  );
});

bot.on("callback_query", async (ctx) => {
  const reg_id = ctx.callbackQuery.data;
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthName = months[date.getMonth()];
  const weekDay = days[date.getDay()];
  const day = date.getDate();
  const res = await axios.get(`https://islom.uz/vaqtlar/${reg_id}/${month}`);
  const $ = cheerio.load(res.data);
  const bomdod = $("tr.bugun > td:nth-child(4)").text();
  const quyosh = $("tr.bugun > td:nth-child(5)").text();
  const peshin = $("tr.bugun > td:nth-child(6)").text();
  const asr = $("tr.bugun > td:nth-child(7)").text();
  const shom = $("tr.bugun > td:nth-child(8)").text();
  const xufton = $("tr.bugun > td:nth-child(9)").text();

  ctx.reply(`
   ☪️ ${ year }-yil\n🗓 ${ day }-${ monthName }\n🍃 ${ weekDay } 🌙\n\n(${ regions.find( ( reg ) => reg.id == reg_id )?.name } viloyati)\n\n🏙  BOMDOD - ${ bomdod }  🕰\n\n🌅  QUYOSH - ${ quyosh}  🕰 \n\n🏞  PESHIN - ${peshin }  🕰\n\n🌇  ASR - ${ asr }  🕰\n\n🌆  SHOM - ${ shom }  🕰\n\n🌃  HUFTON - ${ xufton }  🕰\n\nManbaa: www.islom.uz`,
    {
      reply_markup: {
        inline_keyboard: allRegions,
      },
    }
  );
});

bot.start();
