import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedDatabase() {
  console.log('🌱 Seeding HR Guru Platform with demo data...')

  try {
    // Create demo school
    const school = await prisma.school.upsert({
      where: { code: 'DEMO-001' },
      update: {},
      create: {
        name: 'Greenwood Public School',
        code: 'DEMO-001',
        address: '123 Education Street, New Delhi - 110001',
        phone: '+91-11-1234-5678',
        email: 'admin@greenwoodschool.edu.in',
        board: 'CBSE'
      }
    })

    console.log('✅ Created demo school:', school.name)

    // Create demo teachers
    const teachers = await Promise.all([
      prisma.teacher.upsert({
        where: { employeeId: 'GW-T001' },
        update: {},
        create: {
          employeeId: 'GW-T001',
          firstName: 'Priya',
          lastName: 'Sharma',
          email: 'priya.sharma@greenwoodschool.edu.in',
          phone: '+91-98765-43210',
          joiningDate: new Date('2023-06-15'),
          qualification: ['B.Ed', 'M.A. English'],
          subjects: ['English', 'Literature'],
          grades: ['9', '10', '11', '12'],
          cetScore: 142,
          bedDegree: true,
          experience: 5,
          salary: 45000,
          employmentType: 'PERMANENT',
          schoolId: school.id,
          aadhaar: '1234-5678-9012',
          policeVerified: true,
          pocsoCertified: true
        }
      }),
      prisma.teacher.upsert({
        where: { employeeId: 'GW-T002' },
        update: {},
        create: {
          employeeId: 'GW-T002',
          firstName: 'Rajesh',
          lastName: 'Kumar',
          email: 'rajesh.kumar@greenwoodschool.edu.in',
          phone: '+91-98765-43211',
          joiningDate: new Date('2022-04-10'),
          qualification: ['B.Sc', 'B.Ed', 'M.Sc Mathematics'],
          subjects: ['Mathematics', 'Physics'],
          grades: ['11', '12'],
          cetScore: 156,
          bedDegree: true,
          experience: 8,
          salary: 52000,
          employmentType: 'PERMANENT',
          schoolId: school.id,
          aadhaar: '1234-5678-9013',
          policeVerified: true,
          pocsoCertified: true
        }
      }),
      prisma.teacher.upsert({
        where: { employeeId: 'GW-T003' },
        update: {},
        create: {
          employeeId: 'GW-T003',
          firstName: 'Anita',
          lastName: 'Singh',
          email: 'anita.singh@greenwoodschool.edu.in',
          phone: '+91-98765-43212',
          joiningDate: new Date('2024-01-08'),
          qualification: ['B.A', 'B.Ed'],
          subjects: ['Hindi', 'Social Science'],
          grades: ['6', '7', '8'],
          cetScore: 134,
          bedDegree: true,
          experience: 3,
          salary: 38000,
          employmentType: 'PERMANENT',
          schoolId: school.id,
          aadhaar: '1234-5678-9014',
          policeVerified: true,
          pocsoCertified: false
        }
      })
    ])

    console.log('✅ Created demo teachers:', teachers.length)

    // Create demo applications
    const applications = await Promise.all([
      prisma.application.create({
        data: {
          firstName: 'Meera',
          lastName: 'Patel',
          email: 'meera.patel@email.com',
          phone: '+91-99887-76543',
          position: 'Mathematics Teacher',
          subjects: ['Mathematics', 'Statistics'],
          qualification: ['B.Sc Mathematics', 'B.Ed', 'M.Sc Statistics'],
          experience: 4,
          cetScore: 148,
          aiScore: 87,
          aiRanking: 1,
          aiAnalysis: {
            strengths: ['Strong mathematical background', 'Good CTET score', 'Relevant experience'],
            concerns: ['Limited teaching experience in senior classes'],
            qualificationMatch: 'Excellent',
            recommendation: 'Highly recommended for interview'
          },
          status: 'SCREENING',
          schoolId: school.id
        }
      }),
      prisma.application.create({
        data: {
          firstName: 'Arjun',
          lastName: 'Reddy',
          email: 'arjun.reddy@email.com',
          phone: '+91-99887-76544',
          position: 'Science Teacher',
          subjects: ['Physics', 'Chemistry'],
          qualification: ['B.Sc Physics', 'B.Ed'],
          experience: 2,
          cetScore: 129,
          aiScore: 72,
          aiRanking: 2,
          aiAnalysis: {
            strengths: ['Good subject knowledge', 'Fresh perspective'],
            concerns: ['Limited experience', 'Average CTET score'],
            qualificationMatch: 'Good',
            recommendation: 'Consider for interview with mentoring plan'
          },
          status: 'SUBMITTED',
          schoolId: school.id
        }
      })
    ])

    console.log('✅ Created demo applications:', applications.length)

    // Create demo performance records
    const performances = await Promise.all([
      prisma.performance.create({
        data: {
          teacherId: teachers[0].id,
          reviewDate: new Date('2024-08-15'),
          rating: 4.2,
          feedback: 'Excellent teaching methods and student engagement. Strong command over subject.',
          goals: 'Continue digital pedagogy training',
          reviewedBy: 'Principal'
        }
      }),
      prisma.performance.create({
        data: {
          teacherId: teachers[1].id,
          reviewDate: new Date('2024-08-15'),
          rating: 4.6,
          feedback: 'Outstanding performance in mathematics. Students show significant improvement.',
          goals: 'Mentor junior teachers in problem-solving techniques',
          reviewedBy: 'Principal'
        }
      }),
      prisma.performance.create({
        data: {
          teacherId: teachers[2].id,
          reviewDate: new Date('2024-08-15'),
          rating: 3.8,
          feedback: 'Good performance, needs improvement in classroom management.',
          goals: 'Attend classroom management workshop',
          reviewedBy: 'Vice Principal'
        }
      })
    ])

    console.log('✅ Created demo performance records:', performances.length)

    // Create some attendance records
    const attendancePromises = []
    const startDate = new Date('2024-09-01')
    const endDate = new Date('2024-09-14')

    for (let teacher of teachers) {
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        // Skip weekends
        if (d.getDay() === 0 || d.getDay() === 6) continue
        
        attendancePromises.push(
          prisma.attendance.create({
            data: {
              teacherId: teacher.id,
              date: new Date(d),
              status: Math.random() > 0.1 ? 'PRESENT' : 'ABSENT', // 90% attendance
              checkIn: new Date(d.getTime() + 8 * 60 * 60 * 1000), // 8 AM
              checkOut: new Date(d.getTime() + 16 * 60 * 60 * 1000) // 4 PM
            }
          })
        )
      }
    }

    await Promise.all(attendancePromises)
    console.log('✅ Created demo attendance records')

    console.log('🎉 Demo data seeding completed successfully!')
    console.log('🚀 You can now test the HR Guru platform with realistic data')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}

export { seedDatabase }
