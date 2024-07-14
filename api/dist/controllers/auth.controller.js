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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Creer un new user avec un register 
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        //On verifie si l'email existe déjà en base de donnée
        const user = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        if (user)
            return res.status(400).json({ message: "Email already exist in db!" });
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        console.log(hashedPassword);
        //ajouter le new user dans la db
        const newUser = yield prisma_1.default.user.create({
            data: {
                email,
                passwordDigest: hashedPassword
            }
        });
        //console.log(newUser);
        res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create user!" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Vérification si l'utilisateur existe
        const user = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        // Vérification du mot de passe
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.passwordDigest);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }
        // Génération du token JWT
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            isAdmin: false,
        }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' } // Utilisation de '7d' au lieu de calculer l'âge en millisecondes
        );
        // Extraction des informations utilisateur sans le mot de passe
        const { passwordDigest } = user, userInfo = __rest(user, ["passwordDigest"]);
        // Envoi du token dans les cookies et des informations utilisateur en réponse
        res
            .cookie('token', token, {
            httpOnly: true,
            // secure: true, // Décommenter en production
            maxAge: 1000 * 60 * 60 * 24 * 7,
        })
            .status(200)
            .json(userInfo);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to login!" });
    }
});
exports.login = login;
const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map