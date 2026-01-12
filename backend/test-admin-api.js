const testAdminAPI = async () => {
  try {
    console.log('Testing admin contact API...');
    
    // First, let's test without authentication to see the error
    console.log('\n1. Testing without authentication:');
    const response1 = await fetch('http://localhost:8080/api/v1/contact?page=1&limit=10', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result1 = await response1.json();
    console.log('Response status:', response1.status);
    console.log('Response body:', result1);
    
    // Now let's create an admin user and test with authentication
    console.log('\n2. Creating admin user...');
    const adminResponse = await fetch('http://localhost:8080/api/v1/auth/admin/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'admin123',
        adminSecret: 'admin-secret-key'
      }),
    });

    const adminResult = await adminResponse.json();
    console.log('Admin signup status:', adminResponse.status);
    console.log('Admin signup result:', adminResult);
    
    if (adminResult.success) {
      console.log('\n3. Testing with admin authentication:');
      const response2 = await fetch('http://localhost:8080/api/v1/contact?page=1&limit=10', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminResult.data.token}`,
        },
      });

      const result2 = await response2.json();
      console.log('Authenticated response status:', response2.status);
      console.log('Authenticated response body:', result2);
      
      if (result2.success && result2.data.contacts) {
        console.log('\n✅ Contacts found:', result2.data.contacts.length);
        result2.data.contacts.forEach((contact, i) => {
          console.log(`${i+1}. ${contact.name} - ${contact.email} - ${contact.status}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
};

testAdminAPI();
