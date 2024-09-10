
await fetchAPI("/(api)/user", {
    method: "POST",
    body: JSON.stringify({
      name: form.name,
      email: form.email,
      clerkId: completeSignUp.createdUserId,
    }),
  });


await axios.post("/(api)/user", {
    name: form.name,
    email: form.email,
    clerkId: completeSignUp.createdUserId,
});