const loadCommentsButton = document.getElementById("load-comments-button");
const commentsList = document.getElementById("comments-list");
const noComments = document.getElementById("no-comments");
const getComments = document.getElementById("load-comments");

const commentsForm = document.querySelector("#comments-form form");

const commentTitle = document.getElementById("title");
const commentText = document.getElementById("text");

async function getCommentsForPost(postid) {
  const response = await fetch(`/posts/${postid}/comments`);
  if (response.ok) {
    parseCommentData(response);
  }
}

async function parseCommentData(response) {
  const data = await response.json();
  if (data.length === 0) {
    noComments.style.display = "block";
    commentsList.style.display = "none";
    getComments.style.display = "none";
  } else {
    noComments.style.display = "none";
    commentsList.style.display = "block";
    getComments.style.display = "none";
  }
  renderCommentsOnScreen(data);
}

async function AddCommentToPost(postid, text, title) {
  const request = {
    method: "POST",
    body: JSON.stringify({ text: text, title: title }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(`/posts/${postid}/comments`, request);
    if (response.ok) {
      parseCommentData(response);
    } else {
      alert("Could not send comment!");
    }
  } catch (error) {
    alert("could not send request - try again later");
  }

  commentText.value = "";
  commentTitle.value = "";
}

loadCommentsButton.addEventListener("click", async (event) => {
  getCommentsForPost(loadCommentsButton.dataset.postid);
});

commentsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await AddCommentToPost(
    commentsForm.dataset.postid,
    commentText.value,
    commentTitle.value
  );
});

function renderCommentsOnScreen(comments) {
  commentsList.innerHTML = "";
  let li = "";
  for (const comment of comments) {
    const li = document.createElement("li");
    li.innerHTML = `
      <article class="comment-item">
        <h2>${comment.title}</h2>
        <p>${comment.text}</p>
      </article>`;
    commentsList.appendChild(li);
  }
}
