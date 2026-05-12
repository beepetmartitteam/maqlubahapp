const { Company, Staff, Plan } = require('./models');

async function testAPIRoute() {
  try {
    console.log('Testing exact API route logic...');
    
    const { id } = { id: '2' };
    
    const company = await Company.findByPk(id, {
      include: [
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'name', 'position', 'email', 'phone', 'department', 'status']
        },
        {
          model: Plan,
          as: 'plans',
          attributes: ['id', 'title', 'status', 'deadline', 'priority']
        }
      ]
    });

    console.log('Company found:', !!company);
    if (company) {
      console.log('Company data keys:', Object.keys(company.dataValues));
      console.log('Staff count:', company.staff ? company.staff.length : 0);
      console.log('Plans count:', company.plans ? company.plans.length : 0);
      
      // Test JSON serialization
      const jsonData = company.toJSON();
      console.log('JSON data keys:', Object.keys(jsonData));
      console.log('JSON staff:', jsonData.staff);
      console.log('JSON plans:', jsonData.plans);
    }
    
  } catch (error) {
    console.error('API route test error:', error.message);
    console.error('Full error:', error);
  }
}

testAPIRoute();
