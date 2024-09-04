import prisma from '@/prisma'
import fetch from 'node-fetch'

export default async function handle(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }
    
    const { inscriptionData, userId, sessionId, type } = req.body;

    try {
        const now = new Date();

        const sessionData = await prisma.session.findUnique({
            where: { id: parseInt(sessionId) },
            include: {
                metasSession: true,
                module: true
            }
        });

        let userData;
        let newRegistration;

        if (type === 'special') {
            // Récupération des données du compte pour type "special"
            userData = await prisma.account.findUnique({
                where: { id: parseInt(userId) },
            });

            // Création de l'inscription dans accountRegistration
            newRegistration = await prisma.accountRegistration.create({
                data: {
                    ...inscriptionData,
                    deleted: false,
                    account: {
                        connect: { id: parseInt(userId) },
                    },
                    session: {
                        connect: { id: parseInt(sessionId) },
                    }
                }
            });
        } else {
            // Récupération des données de l'utilisateur pour les types autres que "special"
            userData = await prisma.user.findUnique({
                where: { id: parseInt(userId) },
            });

            // Création de l'inscription dans registration
            newRegistration = await prisma.registration.create({
                data: {
                    ...inscriptionData,
                    deleted: false,
                    user: {
                        connect: { id: parseInt(userId) },
                    },
                    session: {
                        connect: { id: parseInt(sessionId) },
                    }
                }
            });
        }

        const firstProgramme = sessionData.metasSession.programmeSession[0];
        let firstDayStartTime;

        if (firstProgramme.horaires.includes('Jour')) {
            firstDayStartTime = firstProgramme.horaires.split(' : ')[1].split(' - ')[0];
        } else {
            firstDayStartTime = firstProgramme.horaires.split(' - ')[0].trim();
        }

        const dateDebut = new Date(sessionData.dateDebut);
        const formattedDateDebut = dateDebut.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        if(type == "special"){
            const emailResponse = await fetch(`${process.env.WEBSITE_URL}/api/emails/sessionRegister`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prenom: inscriptionData.prenom,
                    email: userData.email,
                    nomRencontre: sessionData.module.nom,
                    dateRencontre: formattedDateDebut,
                    lieuRencontre: sessionData.metasSession.lieuRencontre || 'Lieu',
                    nbJours: sessionData.metasSession.nombreJours,
                    mail_referent: sessionData.metasSession.mail_referent,
                    firstDayStartTime: firstDayStartTime
                })
            });
    
            if (!emailResponse.ok) {
                throw new Error(`Email request failed with status ${emailResponse.status}`);
            }
    
            res.json({
                registration: newRegistration,
                session: sessionData
            });
        }
        else{
            const emailResponse = await fetch(`${process.env.WEBSITE_URL}/api/emails/sessionRegister`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prenom: userData.prenom,
                    email: userData.mail,
                    nomRencontre: sessionData.module.nom,
                    dateRencontre: formattedDateDebut,
                    lieuRencontre: sessionData.metasSession.lieuRencontre || 'Lieu',
                    nbJours: sessionData.metasSession.nombreJours,
                    mail_referent: sessionData.metasSession.mail_referent,
                    firstDayStartTime: firstDayStartTime
                })
            });
    
            if (!emailResponse.ok) {
                throw new Error(`Email request failed with status ${emailResponse.status}`);
            }
    
            res.json({
                registration: newRegistration,
                session: sessionData
            });
        }

    } catch (error) {
        console.error("Error creating registration: ", error);
        res.status(500).json({ error: `Impossible de créer l'enregistrement : ${error.message}` });
    }
}
