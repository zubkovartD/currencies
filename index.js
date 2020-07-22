const Telegraf = require('telegraf');
const axios = require('axios')
const cc = require('currency-codes')

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '1254510972:AAFNSonqpFBLtUv-6NPdYsVT9oqb6XMktuw';

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start(ctx => {
    ctx.reply('Добро пожаловать в бот "Курс валют"');
});

bot.hears(/^[A-Z]+$/i, async ctx => {
    const clientCurCode = ctx.message.text;
    const currency = cc.code(clientCurCode);

    if(!currency) {
        return ctx.reply('Валюта не найдена, введите на английском и капсом')
    }
    try {
        const currencyObj = await axios.get('https://api.monobank.ua/bank/currency');
        const foundCurrency = currencyObj.data.find(cur => {
            return cur.currencyCodeA.toString() === currency.number;
        })
        if(!foundCurrency || !foundCurrency.rateBuy ||foundCurrency.rateSell){
            return ctx.reply('Видимо, нету валюты в АПИ Монобанка')
        }
        return ctx.replyWithMarkdown(
            `CURRENCY: ${currency.code}
    RATE BUY: ${foundCurrency.rateBuy}
    RATE SELL: ${foundCurrency.rateSell}`
        );
    } catch (error){
        return ctx.reply(error);
    }
})

bot.startPolling();