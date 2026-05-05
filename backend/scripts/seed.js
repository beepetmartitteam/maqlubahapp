const { User, Customer, CustomerNote } = require('../models');
require('dotenv').config();

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Create sample users
        const users = [
            {
                email: 'admin@maqlubah.com',
                password: 'password123',
                firstName: 'Admin',
                lastName: 'User',
                location: 'Medan',
                oauthProvider: 'local'
            },
            {
                email: 'customer1@example.com',
                password: 'password123',
                firstName: 'Darwis',
                lastName: 'Nurhadi',
                location: 'Medan',
                oauthProvider: 'local'
            }
        ];

        for (const userData of users) {
            await User.findOrCreate({
                where: { email: userData.email },
                defaults: userData
            });
        }

        // Create sample customers
        if (users.length >= 2) {
            const customers = [
                {
                    name: 'DARWIS NURHADI',
                    location: 'Medan',
                    birthDate: '1997-02-14',
                    address: 'No. 18, Jalan Anggerik 3/2, Seksyen 3, 40000 Shah Alam, Selangor',
                    phone: '+601234567890',
                    email: 'darwis@example.com',
                    age: '27 tahun',
                    kerjaya: 'Usahawan',
                    kerjasama: 'Telah bekerjasama dalam pelbagai projek perniagaan dan pembangunan komuniti. Sangat komited dan profesional dalam semua urusan.',
                    kehidupanKeluarga: 'Berkeluarga bahagia dengan 3 orang anak. Sangat mementingkan masa berkualiti bersama keluarga dan keseimbangan hidup.',
                    notes: 'Catitan Pertemuan',
                    userId: users[1].id
                },
                {
                    name: 'Tn SHukri Md Nor',
                    location: 'Kuala Lumpur',
                    birthDate: '1985-06-15',
                    address: 'Jalan Raja Chulan 1/2, 50200 Kuala Lumpur',
                    phone: '+601234567891',
                    email: 'shukri@example.com',
                    age: '38 tahun',
                    kerjaya: 'Pengurus Syarikat',
                    kerjasama: 'Pengalaman lebih 15 tahun dalam pengurusan syarikat teknologi.',
                    kehidupanKeluarga: 'Berkeluarga dengan 4 orang anak, mengutamakan pendidikan anak-anak.',
                    notes: 'Pelanggan setia sejak 2020',
                    userId: users[2].id
                }
            ];

            for (const customerData of customers) {
                await Customer.findOrCreate({
                    where: { name: customerData.name, userId: customerData.userId },
                    defaults: customerData
                });
            }

            // Create sample notes
            const notes = [
                {
                    caption: 'Pertemuan pertama',
                    note: 'pertemuan di lakukan tertutup, turut hadir 10 orang, masing-masing memperkenalkan diri',
                    images: ['http://localhost:5000/uploads/meeting1.jpg', 'http://localhost:5000/uploads/meeting2.jpg'],
                    customerId: customers[0].id
                },
                {
                    caption: 'Perbincangan projek',
                    note: 'Membincangkan projek kerjasama untuk tahun depan dengan fokus pada teknologi hijau.',
                    images: ['http://localhost:5000/uploads/project1.jpg'],
                    customerId: customers[0].id
                }
            ];

            for (const noteData of notes) {
                await CustomerNote.create(noteData);
            }
        }

        console.log('Database seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
