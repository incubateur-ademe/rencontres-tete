import prisma from '@/prisma'
import fetch from 'node-fetch'

export default async function handle(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }
    
    try {
        const today = new Date();

        const pastSessions = await prisma.session.findMany({
            where: {
                dateDebut: {
                    lte: today,
                },
            },
            include: {
                registrations: {
                    include: {
                        user: true,
                    },
                },
                accountRegistrations: {
                    include: {
                        account: true,
                    },
                },
                metasSession: true,
                module: true,
            },
        });

        for (const session of pastSessions) {
            // Convertir 0.5 jours ou 1 jour en 1 jour, et garder 2 jours tel quel
            const nombreJours = parseFloat(session.metasSession.nombreJours);
            const joursPourEnvoi = nombreJours <= 1 ? 1 : 2;

            const dateDebut = new Date(session.dateDebut);
            const expectedEmailDate = new Date(dateDebut);
            expectedEmailDate.setDate(dateDebut.getDate() + joursPourEnvoi);

            // Vérifier si aujourd'hui correspond au jour d'envoi
            if (today.toDateString() !== expectedEmailDate.toDateString()) {
                continue; // Passer à la session suivante si ce n'est pas le bon jour pour envoyer l'email
            }

            const firstProgramme = session.metasSession.programmeSession[0];
            let firstDayStartTime;

            if (firstProgramme.horaires.includes('Jour')) {
                firstDayStartTime = firstProgramme.horaires.split(' : ')[1].split(' - ')[0];
            } else {
                firstDayStartTime = firstProgramme.horaires.split(' - ')[0].trim();
            }

            const formattedDateDebut = dateDebut.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

            for (const registration of session.registrations) {
                const userData = registration.user;

                const emailResponse = await fetch(`${process.env.WEBSITE_URL}/api/emails/sessionAfterDays`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prenom: userData.prenom,
                        email: userData.mail,
                    })
                });

                if (!emailResponse.ok) {
                    throw new Error(`Email request failed with status ${emailResponse.status}`);
                }
            }

            for (const accountRegistration of session.accountRegistrations) {
                const accountData = accountRegistration.account;
        
                const emailResponse = await fetch(`${process.env.WEBSITE_URL}/api/emails/sessionAfterDays`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prenom: accountData.email.split('@')[0],
                        email: accountData.email
                    })
                });
        
                if (!emailResponse.ok) {
                    throw new Error(`Email request failed with status ${emailResponse.status}`);
                }
            }  
        }

        res.status(200).json({ message: "Emails sent successfully" });
    } catch (error) {
        console.error("Error fetching past sessions or sending emails: ", error);
        res.status(500).json({ error: `Impossible de récupérer les enregistrements ou d'envoyer les emails : ${error.message}` });
    }
}
