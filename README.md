# This is a RESTful API called personal-blogging-api

Built with **NodeJS, TypeScript and MySQL**, it basically does the following CRUD operations:

- Allows you to get a list of articles, and also filter them with their tags.
- Returns a single article.
- Allows you to create a new article and add tags to them.
- Allows you to update an article.
- Allows you to delete an article.

  # Routes

  - ## GET (`${base_url}/articles/all`)

    This get's you all the articles available

    ### Sample Response

    ```json
    {
      "message": "Fetched successfully!",
      "articles": [
        {
          "id": 1,
          "article": "New me baby! This should be great!",
          "created_at": "2024-05-28T09:19:30.000Z",
          "updated_at": "2024-05-28T09:19:30.000Z",
          "tags": [
            {
              "id": 1,
              "tag": "great"
            },
            {
              "id": 2,
              "tag": "best"
            }
          ]
        }
      ]
    }
    ```

  - ## GET (`${base_url}/articles/all?tags=great,best`)

    This filters the articles by tags,
    **NB**: Tags are comma separated

    ### Sample Response

    ```json
    {
      "message": "Fetched successfully!",
      "articles": [
        {
          "id": 1,
          "article": "New me baby! This should be great!",
          "created_at": "2024-05-28T09:19:30.000Z",
          "updated_at": "2024-05-28T09:19:30.000Z",
          "tags": [
            {
              "id": 1,
              "tag": "great"
            },
            {
              "id": 2,
              "tag": "best"
            }
          ]
        }
      ]
    }
    ```

  - ## GET (`${base_url}/articles/single/4`)

    This get's you a single article `1` here is the article id.

    ### Sample Response

    ```json
    {
      "message": "Fetched article successfully!",
      "article": {
        "id": 4,
        "article": "This is a really great article!",
        "created_at": "2024-05-29T18:19:43.000Z",
        "updated_at": "2024-05-30T03:36:40.000Z",
        "tags": [
          {
            "id": 1,
            "tag": "great"
          }
        ]
      }
    }
    ```

  - ## POST (`${base_url}/articles/create`)

    This is to create a new article.
    **NB**: all fields are compulsory, tags field is comma separated.

    ### Sample Payload

    ```json
    {
      "article": "Fate is a strange thing",
      "tags": "fate, future"
    }
    ```

    ### Sample Response

    ```json
    {
      "message": "Article created successfully!",
      "data": {
        "article": "Fate is a strange thing",
        "tags": ["fate", "future"]
      }
    }
    ```

  - ## PUT (`${base_url}/articles/single/update/4`)

    This is to update an existing article.
    **NB**: The `4` represents the article id, the body of the request must contain the new value of the article.

    ### Sample Payload

    ```json
    {
      "article": "Woo, I am saved! The whole earth should know this!"
    }
    ```

    ### Sample Response

    ```json
    {
      "message": "Article updated successfully",
      "article": {
        "id": 4,
        "article": "Woo, I am saved! The whole earth should know this!",
        "created_at": "2024-05-29T18:19:43.000Z",
        "updated_at": "2024-05-30T04:11:46.000Z",
        "tags": [
          {
            "id": 1,
            "tag": "great"
          }
        ]
      }
    }
    ```

  - ## DELETE (`${base_url}/articles/single/4`)

    This is to delete an article.
    **NB**: The `4` represents the article id

    ### Sample Response

    ```json
    {
      "message": "Article deleted successfully!"
    }
    ```
