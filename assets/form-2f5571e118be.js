/** Shared, dependency-free contact validation. The mail provider also validates requests. */
export const FORM_LIMITS = Object.freeze({name:100,email:254,message:5000});
export function validateMessage(input = {}) {
  const values = Object.fromEntries(['name','email','message'].map(k=>[k,String(input[k]??'').trim()]));
  const errors = {};
  if (values.name.length < 2) errors.name='Please enter your name (at least 2 characters).';
  else if (values.name.length > FORM_LIMITS.name) errors.name='Please use no more than 100 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email) || values.email.length > FORM_LIMITS.email) errors.email='Please enter a valid email address.';
  if (!values.message) errors.message='Please add a message so I know how to reply.';
  else if (values.message.length > FORM_LIMITS.message) errors.message='Please keep your message within 5,000 characters.';
  return {values,errors,valid:Object.keys(errors).length===0};
}
