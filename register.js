const url = 'https://sisootunmrgmbawvacws.supabase.co/auth/v1/signup';
const anonKey = 'sb_publishable_XM2jJ-xxAX4XqKDXVbELUw_QeN3A7De';

async function register() {
  console.log('Registering user via REST...');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'ideas100technologies@gmail.com',
      password: 'Vv555556',
      data: {
        full_name: 'Admin',
        phone: '+380990000000',
        role: 'user'
      }
    })
  });

  const data = await response.json();
  if (response.ok) {
    console.log('Successfully registered!', data);
  } else {
    console.error('Registration Error:', data);
  }
}

register();
