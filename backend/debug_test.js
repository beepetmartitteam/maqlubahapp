const { Company, Report, Staff, Plan } = require('./models');

async function debugFullRoute() {
  try {
    console.log('Testing exact route logic...');
    const { id } = { id: '1' };
    
    const company = await Company.findByPk(id, {
      include: [
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'name', 'position', 'email', 'phone', 'department', 'status', 'hire_date', 'salary']
        },
        {
          model: Plan,
          as: 'plans',
          include: [
            {
              model: Staff,
              as: 'assignedStaff',
              attributes: ['id', 'name', 'position']
            }
          ]
        },
        {
          model: Report,
          as: 'reports',
          attributes: ['id', 'title', 'type', 'status', 'created_at'],
          include: [
            {
              model: Staff,
              as: 'creator',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    console.log('Full route logic test passed');
    console.log('Company data:', company ? 'found' : 'not found');
  } catch (error) {
    console.error('Full route logic failed:', error.message);
    console.error('Full error:', error);
  }
}

debugFullRoute();
