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
        const twoWeeksLater = new Date(today);
        twoWeeksLater.setDate(today.getDate() + 3);

        const upcomingSessions = await prisma.session.findMany({
            where: {
                dateDebut: {
                    equals: twoWeeksLater,
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

        for (const session of upcomingSessions) {
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

                const emailResponse = await fetch(`${process.env.WEBSITE_URL}/api/emails/sessionDays`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prenom: userData.prenom,
                        email: userData.mail,
                        nomRencontre: session.module.nom,
                        dateRencontre: formattedDateDebut,
                        lieuRencontre: session.metasSession.lieuRencontre || 'Lieu',
                        nbJours: session.metasSession.nombreJours,
                        mail_referent: session.metasSession.mail_referent,
                        firstDayStartTime: firstDayStartTime
                    })
                });

                if (!emailResponse.ok) {
                    throw new Error(`Email request failed with status ${emailResponse.status}`);
                }
            }
        }

        res.status(200).json({ message: "Emails sent successfully" });
    } catch (error) {
        console.error("Error fetching upcoming sessions or sending emails: ", error);
        res.status(500).json({ error: `Impossible de récupérer les enregistrements ou d'envoyer les emails : ${error.message}` });
    }
}
