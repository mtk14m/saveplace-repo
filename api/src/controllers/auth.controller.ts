import { Request, Response } from "express";
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt'
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

//Creer un new user avec un register 

export const register = async (req: Request, res: Response)=>{
    const {email, password} = req.body;

    try{
        //On verifie si l'email existe déjà en base de donnée
        const user : User | null = await prisma.user.findUnique({
            where: {email},
        });

        if(user) return res.status(400).json({message: "Email already exist in db!"});

        const hashedPassword:string = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        //ajouter le new user dans la db
        const newUser: User = await prisma.user.create({
            data: { 
                email, 
                passwordDigest:hashedPassword
            }
        })
        //console.log(newUser);
        res.status(201).json({ message: "User created successfully" });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Failed to create user!" });
    }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Vérification si l'utilisateur existe
    const user: User | null = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Vérification du mot de passe
    const isPasswordValid: boolean = await bcrypt.compare(password, user.passwordDigest);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Génération du token JWT
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '7d' } // Utilisation de '7d' au lieu de calculer l'âge en millisecondes
    );

    // Extraction des informations utilisateur sans le mot de passe
    const { passwordDigest, ...userInfo } = user;

    // Envoi du token dans les cookies et des informations utilisateur en réponse
    res
      .cookie('token', token, {
        httpOnly: true,
        // secure: true, // Décommenter en production
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(200)
      .json(userInfo);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};


export const logout = (req: Request, res: Response) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};




