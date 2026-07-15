const applicants = [
    { name: 'Budi Pekerti Luhur', email: 'budipekerti@gmail.com' },
    { name: 'Doni Irawan', email: 'doniirawan@gmail.com' },
    { name: 'Sandi Uno', email: 'sandiuno@gmail.com' },
    { name: 'Jessica Wongso', email: 'jessicawongso@gmail.com' },
    { name: 'Tio Makarim', email: 'tiomakarim@gmail.com' },
]

export const approvalReferrals = Array.from({ length: 24 }, (_, index) => {
    const applicant = applicants[index % applicants.length]
    const submittedAt = new Date()
    submittedAt.setDate(submittedAt.getDate() - ((index % 7) + 1))

    return {
        id: index + 1,
        name: applicant.name,
        email: applicant.email,
        usi: '26.B1.00023',
        faculty: 'Ilmu Komputer',
        major: 'Sistem Informasi',
        education_level: 'S1',
        submitted_at: submittedAt.toISOString(),
    }
})
