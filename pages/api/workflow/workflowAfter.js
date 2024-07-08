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
        const oneDayafter = new Date(today);
        oneDayafter.setDate(today.getDate() - 1);
        oneDayafter.setHours(0, 0, 0, 0);
        
        const startOfDay = new Date(oneDayafter);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(oneDayafter);
        endOfDay.setHours(23, 59, 59, 999);
        
        const pastSessions = await prisma.session.findMany({
            where: {
                dateDebut: {
                    gte: startOfDay,
                    lt: endOfDay,
                },
            },
            include: {
                registrations: {
                    include: {
                        user: true,
                    },
                },
                metasSession: true,
                module: true,
            },
        });

        for (const session of pastSessions) {
            const firstProgramme = session.metasSession.programmeSession[0];
            let firstDayStartTime;

            if (firstProgramme.horaires.includes('Jour')) {
                firstDayStartTime = firstProgramme.horaires.split(' : ')[1].split(' - ')[0];
            } else {
                firstDayStartTime = firstProgramme.horaires.split(' - ')[0].trim();
            }

            const dateDebut = new Date(session.dateDebut);
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
        }

        res.status(200).json({ message: "Emails sent successfully" });
    } catch (error) {
        console.error("Error fetching past sessions or sending emails: ", error);
        res.status(500).json({ error: `Impossible de récupérer les enregistrements ou d'envoyer les emails : ${error.message}` });
    }
}
