describe('JSONPlaceholder API Test', () => {
  it('should create a new post via POST request and receive a successful response', async () => {
    const newPostData = {
      title: 'My Test Post',
      body: 'This is the content of my test post.',
      userId: 1, // Example user ID
    };

    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPostData),
    });

    // Assert the response status and body
    expect(response.status).toBe(201); // JSONPlaceholder returns 201 Created for successful POST
    const responseBody = await response.json();

    // Assert that the response body contains the data sent and a new ID
    expect(responseBody).toHaveProperty('id');
    expect(responseBody.title).toBe(newPostData.title);
    expect(responseBody.body).toBe(newPostData.body);
    expect(responseBody.userId).toBe(newPostData.userId);
  });
});