"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMPT_HOST,
        port: parseInt(process.env.SMPT_PORT || '587'),
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });
    const { email, subject, template, data } = options;
    // get the pdath to the email template file
    const templatePath = path_1.default.join(__dirname, "../mails", template);
    // Render the email template with EJS
    const html = yield ejs_1.default.renderFile(templatePath, data);
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html,
    };
    yield transporter.sendMail(mailOptions);
});
exports.default = sendMail;
