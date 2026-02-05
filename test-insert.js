
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dhlskitfujcyxbbancad.supabase.co';
const supabaseKey = 'sb_publishable_kWVcG8ZYzjmYhHNOMKUtBQ_y8UKdZkk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log('Testing Supabase insert via JS client...');
    const { data, error } = await supabase
        .from('clients')
        .insert([
            {
                first_name: 'Auth',
                last_name: 'Test',
                company: 'Key Verification Inc',
                role: 'Tester',
                email: 'keytest@test.com',
                mobile_phone: '12345678',
                created_at: new Date().toISOString(),
            }
        ]);

    if (error) {
        console.error('❌ Insert FAILED:', error.message);
        if (error.code) console.error('Error Code:', error.code);
    } else {
        console.log('✅ Insert SUCCESS!');
    }
}

testInsert();
