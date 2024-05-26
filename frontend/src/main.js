import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';


//display or hide rm button, select will link to <input> element 
function controlRmButton(select,selectButton) {
  if (select.value) {
    selectButton.style.opacity = 1;
  } else {
    selectButton.style.opacity = 0;
  }
}

//main part
window.addEventListener("load", function () {

  // control page display, initially show login page
  let mainElement = document.querySelector("main");
  const token = localStorage.getItem("token");
  if (token) {
    console.log("token permitted");
    mainElement.classList.remove("hidden-qanda-status");
    mainElement.classList.add("hidden-registration-status", "hidden-login-status");
  } else {
    if (mainElement) {
      mainElement.classList.remove("hidden-login-status");
      mainElement.classList.add("hidden-registration-status", "hidden-qanda-status");
    }
  }

  // control qanda right side page, initially show main page
  const isMainRemoved1 = localStorage.getItem("isMainRemoved");
  const isNewRemoved1 = localStorage.getItem("isNewRemoved");
  const isEditRemoved1 = localStorage.getItem("isEditRemoved")
  const dContent = document.getElementById("disindf-content");

  if (isMainRemoved1 === 'true' && isNewRemoved1 === 'true' && isEditRemoved1 === 'true') {
    localStorage.setItem("isDetailRemoved",'true')
    localStorage.setItem("isMainRemoved",'false')
  }
  const isDetailRemoved = localStorage.getItem("isDetailRemoved");
  const isMainRemoved = localStorage.getItem("isMainRemoved");
  const isNewRemoved = localStorage.getItem("isNewRemoved");
  const isEditRemoved = localStorage.getItem("isEditRemoved")

  if (!isMainRemoved && !isNewRemoved && !isDetailRemoved && !isEditRemoved) {
    dContent.classList.add("hidden-new-status", "hidden-detail-status", "hidden-edit-status");
    dContent.classList.remove("hidden-main-status");
  } else {
    if (isMainRemoved === 'true') {
      dContent.classList.add("hidden-main-status");
    } else {
      dContent.classList.remove("hidden-main-status");
    }

    if (isNewRemoved === "true") {
      dContent.classList.add("hidden-new-status");
    } else {
      dContent.classList.remove("hidden-new-status");
    }
    
    if (isEditRemoved === "true") {
      dContent.classList.add("hidden-edit-status");
    } else {
      dContent.classList.remove("hidden-edit-status");
    }

    if (isDetailRemoved === 'true') {
      dContent.classList.add("hidden-detail-status");
    } else {
      dContent.classList.remove("hidden-detail-status");
    }
  }


  // cursor decoration
  let cursorRing = document.createElement('div');
  cursorRing.classList.add('cursor-ring');
  document.body.appendChild(cursorRing);

  document.addEventListener('mousemove', function(e) {
      cursorRing.style.left = e.pageX + 'px';
      cursorRing.style.top = e.pageY + 'px';
  });

  //apiCall
  const apiCall = (path, body) => {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:5005/' + path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          reject(data.error);
        } else {
          console.log(data); 
          resolve(data); 
        }
      })
      .catch((error) => {
        console.log("Fetch error:", error);
        reject(error); 
      });
    });
  };

  const apiCallPost = (path, token, body) => {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:5005/' + path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          reject(data.error);
        } else {
          console.log(data); 
          resolve(data); 
        }
      })
      .catch((error) => {
        console.log("Fetch error:", error);
        reject(error); 
      });
    });
  };

  const apiCallPut = (path, token, body) => {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:5005/' + path, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          reject(data.error);
        } else {
          console.log(data); 
          resolve(data); 
        }
      })
      .catch((error) => {
        console.log("Fetch error:", error);
        reject(error); 
      });
    });
  };

  const apiCallDelete = (path, token, body) => {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:5005/' + path, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          reject(data.error);
        } else {
          console.log(data); 
          resolve(data); 
        }
      })
      .catch((error) => {
        console.log("Fetch error:", error);
        reject(error); 
      });
    });
  };
  

  const apiCallGet = (path, token, queryString) => {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:5005/' + path + '?' + queryString, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
          reject(error);
        } else {
          console.log(data);
          resolve(data);
        }
      });
    });
};

  //login page begin
  // element reference for login page
  const loginEmail = document.getElementById("login-mail");
  const rmLoginEmail = document.getElementById("rm-email-1");
  const loginPassword = document.getElementById("login-pword");
  const rmLoginPassword = document.getElementById("rm-password-1")
  const hideLoginPassword = document.getElementById("hidden-password-1");
  const loginButton = document.getElementById("login-button");
  const signUpButton = document.getElementById("sign-up-button");

  //Binding login page events begin

  //email begin
  loginEmail.addEventListener("input", function(e) {

    //check email validity
    if (this.validity.typeMismatch) {
      this.setCustomValidity("I expect an e-mail, darling!");
    } else {
      this.setCustomValidity("");
    }

    //check rm button display(hidden or not)
    controlRmButton(this,rmLoginEmail);
  });

  loginEmail.addEventListener("focus", function(e) {
    this.parentNode.classList.add("focus-border");
    controlRmButton(this,rmLoginEmail);
  });


  rmLoginEmail.addEventListener("mousedown", function() {
    if (this.style.opacity === '1') {
      loginEmail.value = "";
    }
  });

  loginEmail.addEventListener("blur", function(e) {
    this.parentNode.classList.remove("focus-border");
    rmLoginEmail.style.opacity = 0;
  });
  //email end

  //password begin
  loginPassword.addEventListener("input", function(e) {
    if (this.validity.typeMismatch) {
      this.setCustomValidity("I expect a password, darling!");
    } else {
      this.setCustomValidity("");
    }
    
    controlRmButton(this,rmLoginPassword);
  });

  loginPassword.addEventListener("focus", function(e) {
    this.parentNode.classList.add("focus-border");
    controlRmButton(this,rmLoginPassword);
  });


  rmLoginPassword.addEventListener("mousedown", function() {
    if (this.style.opacity === '1') {
      loginPassword.value = "";
    }
  });

  loginPassword.addEventListener("blur", function(e) {
    this.parentNode.classList.remove("focus-border");
    rmLoginPassword.style.opacity = 0;
  });

  hideLoginPassword.addEventListener("click", function(e) {
    if (loginPassword.type === 'password') {
      loginPassword.type = 'text';
    } else {
      loginPassword.type = 'password';
    }
  });
  //password end

  //Login button begin, if password correct, change page from login to qanda
  loginButton.addEventListener("click", function(e) {
    e.preventDefault();
    const body = {
      "email": loginEmail.value,
      "password": loginPassword.value
    };
    apiCall("auth/login", body)
    .then((data) => {
      alert("login success!")
      mainElement.classList.remove("hidden-qanda-status");          
      mainElement.classList.add("hidden-registration-status", "hidden-login-status");  
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      location.reload();
    })
    .catch((error) => {
      console.log("");
    })
  });
  //login button end

  //Sign up button begin change page from login to registration
  signUpButton.addEventListener("click", function(e) {
    mainElement.classList.remove("hidden-registration-status");
    mainElement.classList.add("hidden-login-status", "hidden-qanda-status");
  });
  //Sign up button end
  //Binding login page events end
  //login page end







  //registration page begin
  //element reference for registration page
  const returnToLoginPage = document.getElementById("return-button");
  const registerEmail = document.getElementById("register-mail");
  const rmRegisterEmail = document.getElementById("rm-email-2");
  const registerName = document.getElementById("register-name");
  const rmRegisterName = document.getElementById("rm-name");
  const registerPassword = document.getElementById("register-pword");
  const rmRegisterPassword = document.getElementById("rm-password-2")
  const hideRegisterPassword = document.getElementById("hidden-password-2");
  const confirmPassword = document.getElementById("register-confirm-pword");
  const rmConfirmPassword = document.getElementById("rm-password-3");
  const hideConfirmPassword = document.getElementById("hidden-password-3");
  const registerButton = document.getElementById("register-button");

  //Binding register page events begin

  //return button begin
  returnToLoginPage.addEventListener("click", function(e) {
    mainElement.classList.remove("hidden-login-status");
    mainElement.classList.add("hidden-registration-status", "hidden-qanda-status");   
  });
  //return button end

  //email begin
  registerEmail.addEventListener("input", function(e) {

    //check email validity
    if (this.validity.typeMismatch) {
      this.setCustomValidity("I expect an e-mail, darling!");
    } else {
      this.setCustomValidity("");
    }

    //check rm button display(hidden or not)
    controlRmButton(this,rmRegisterEmail);
  });

  registerEmail.addEventListener("focus", function(e) {
    this.parentNode.classList.add("focus-border");
    controlRmButton(this,rmRegisterEmail);
  });


  rmRegisterEmail.addEventListener("mousedown", function() {
    if (this.style.opacity === '1') {
      registerEmail.value = "";
    }
  });

  registerEmail.addEventListener("blur", function(e) {
    this.parentNode.classList.remove("focus-border");
    rmRegisterEmail.style.opacity = 0;
  });
  //email end

  //name begin
  registerName.addEventListener("input", function(e) {

    //check email validity
    if (this.validity.typeMismatch) {
      this.setCustomValidity("I expect a name, darling!");
    } else {
      this.setCustomValidity("");
    }

    //check rm button display(hidden or not)
    controlRmButton(this,rmRegisterName);
  });

  registerName.addEventListener("focus", function(e) {
    this.parentNode.classList.add("focus-border");
    controlRmButton(this,rmRegisterName);
  });


  rmRegisterName.addEventListener("mousedown", function() {
    if (this.style.opacity === '1') {
      registerName.value = "";
    }
  });

  registerName.addEventListener("blur", function(e) {
    this.parentNode.classList.remove("focus-border");
    rmRegisterName.style.opacity = 0;
  });
  //name end

  //register password begin
  registerPassword.addEventListener("input", function(e) {
    if (this.validity.typeMismatch) {
      this.setCustomValidity("I expect a password, darling!");
    } else {
      this.setCustomValidity("");
    }
    
    controlRmButton(this,rmRegisterPassword);
  });

  registerPassword.addEventListener("focus", function(e) {
    this.parentNode.classList.add("focus-border");
    controlRmButton(this,rmRegisterPassword);
  });


  rmRegisterPassword.addEventListener("mousedown", function() {
    if (this.style.opacity === '1') {
      registerPassword.value = "";
    }
  });

  registerPassword.addEventListener("blur", function(e) {
    this.parentNode.classList.remove("focus-border");
    rmRegisterPassword.style.opacity = 0;
  });

  hideRegisterPassword.addEventListener("click", function(e) {
    if (registerPassword.type === 'password') {
      registerPassword.type = 'text';
    } else {
      registerPassword.type = 'password';
    }
  });
  //register password end

  //confirm password begin
  confirmPassword.addEventListener("input", function(e) {
    if (this.validity.typeMismatch) {
      this.setCustomValidity("I expect a password, darling!");
    } else {
      this.setCustomValidity("");
    }
    
    controlRmButton(this,rmConfirmPassword);
  });

  confirmPassword.addEventListener("focus", function(e) {
    this.parentNode.classList.add("focus-border");
    controlRmButton(this,rmConfirmPassword);
  });


  rmConfirmPassword.addEventListener("mousedown", function() {
    if (this.style.opacity === '1') {
      confirmPassword.value = "";
    }
  });

  confirmPassword.addEventListener("blur", function(e) {
    this.parentNode.classList.remove("focus-border");
    rmConfirmPassword.style.opacity = 0;
  });

  hideConfirmPassword.addEventListener("click", function(e) {
    if (confirmPassword.type === 'password') {
      confirmPassword.type = 'text';
    } else {
      confirmPassword.type = 'password';
    }
  });
  //confirm password end

  //register button begin
  registerButton.addEventListener("click", function(e) {
    e.preventDefault();
    if (registerPassword.value !== confirmPassword.value) {
      registerPassword.value = '';
      confirmPassword.value = '';
      alert('The two passwords do not match. Please try again');
    } else if (registerEmail.validity.typeMismatch) {
      registerEmail.value = '';
      alert('Invalid email format');
    } else {
      const body = {
        email: registerEmail.value,
        password: registerPassword.value,
        name: registerName.value
      };
      apiCall("auth/register", body)
      .then((data) => {
        alert("register success!")
        mainElement.classList.remove("hidden-qanda-status");          
        mainElement.classList.add("hidden-registration-status", "hidden-login-status");  
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        let token = localStorage.getItem("token");
        location.reload();
      })
      .catch((error) => {
        console.log("");
      })
    }
  });
  //register button end
  //registration page end





  //qanda page begin
  //element reference for qanda page
  const logoutButton = document.getElementById("logout");
  const userButton = document.getElementById("user");
  const newThread = document.getElementById("new-thread");
  const dragBar = document.querySelector(".split-divider");
  const newCancel = document.getElementById("new-cancel");
  const newPosts = document.querySelectorAll(".new-post");



  //allow dragBar controling page width allocation
  dragBar.addEventListener('mousedown', function(e) {
    e.preventDefault();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    let prevX = e.clientX;

    function onMouseMove(e) {
      // let newX = prevX - e.clientX;
      // prevX = e.clientX;
      const splitPanel = document.querySelector(".split-panel");
      splitPanel.style.flex = `0 0 ${e.clientX}px`;
    }
    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  });

  //logout
  logoutButton.addEventListener("click", function(e) {
    localStorage.removeItem("token"); 
    localStorage.removeItem("isMainRemoved");
    localStorage.removeItem("isNewRemoved");
    localStorage.removeItem("isDetailRemoved");
    localStorage.removeItem("isEditRemoved");
    localStorage.removeItem("currentId");
    localStorage.removeItem("userId");
    location.reload();
  });

  //make a new thread
  newThread.addEventListener("click", function(e) {
    dContent.classList.remove("hidden-new-status");
    dContent.classList.add("hidden-main-status", "hidden-detail-status", "hidden-edit-status");
    localStorage.setItem("isMainRemoved", 'true');
    localStorage.setItem("isNewRemoved", 'false');
    localStorage.setItem("isDetailRemoved", 'true');
    localStorage.setItem("isEditRemoved", 'true');
  });

  newCancel.addEventListener("click", function(e) {
    dContent.classList.remove("hidden-main-status");
    dContent.classList.add("hidden-new-status", "hidden-detail-status", "hidden-edit-status");
    localStorage.setItem("isMainRemoved", 'false');
    localStorage.setItem("isNewRemoved", 'true');
    localStorage.setItem("isDetailRemoved", 'true');
    localStorage.setItem("isEditRemoved", 'true');
  });

  let index = 0;
  let oldThreadList = null;
  apiCallGet("threads", token, `start=${index}`)
  .then((data) => {
    setThreadList(data);
    index += 5;
  }); 

  function loadMoreThread(index) {
    apiCallGet("threads", token, `start=${index}`)
    .then((data) => {
      setThreadList(data);
      index += 5;
    });
  }

  function setThreadList(threadList) {
    const threadListElement = document.getElementById("thread-list");
    if (JSON.stringify(threadList) !== JSON.stringify(oldThreadList)) {
      console.log("对比");
      console.log(oldThreadList);
      console.log(threadList);
      oldThreadList = threadList;
      threadList.forEach(function(threadId) {
        apiCallGet("thread", token, `id=${threadId}`)
        .then((data) => {
          const date = new Date(data.createdAt);
          apiCallGet("user", token, `userId=${data.creatorId}`)
          .then((data) => {
            localStorage.setItem("userName",data.name)
          });
          const name = localStorage.getItem("userName");
          const newContent = `
          <div id="${data.id}" role="option" class="div-item">
          <div class="dft-full">
              <div class="dft-body">
                  <span class="dft-title">${data.title}</span>
              </div>
                  <footer class="dft-foot">
                      <div class="dft-foot-fill">
                          <span class="dft-user">${name}</span>
                          <div class="dft-date">
                              <time datetime="">${date.toLocaleString()}</time>
                          </div>
                      </div>
                      <span class="dft-count-icon" title="like">
                          <span class="material-symbols-outlined thread-list-like-icon">Favorite</span>
                      </span>
                      <div title="like" class="dft-count" id="${data.id}-like-num">${data.likes.length}</div>
                  </footer>
              </div>
          </div>`;
          threadListElement.insertAdjacentHTML('beforeend', newContent);
  
          // add click
          const options = document.querySelectorAll(".div-item");
          options.forEach(function(option) {
            option.addEventListener("click", function(e) {
              let id = option.id;
              setDetailPage(parseInt(id, 10));
              dContent.classList.remove("hidden-detail-status");          
              dContent.classList.add("hidden-new-status", "hidden-main-status", "hidden-edit-status");
              localStorage.setItem("isMainRemoved", 'true');
              localStorage.setItem("isNewRemoved", 'true');
              localStorage.setItem("isDetailRemoved", 'false');  
              localStorage.setItem("isEditRemoved", 'true');
            });
          });
        });
      });

      //delete button already have
      const existingMoreButton = document.getElementById("more-button");
      if (existingMoreButton) {
        existingMoreButton.remove();
      }
      //add new button
      const moreButton = `
      <button type="button" class="more-button" id="more-button">more</button>
      `
      threadListElement.insertAdjacentHTML("afterend", moreButton);

      document.getElementById("more-button").addEventListener('click', function() {
        loadMoreThread(index);
        console.log('More button clicked');
    });
    } else {
      const existingMoreButton = document.getElementById("more-button");
      if (existingMoreButton) {
        existingMoreButton.remove();
      }
    }


  }

  function setDetailPage(id) {
    //pure num
    localStorage.setItem("currentId", id);

    apiCallGet("thread", token, `id=${id}`)
    .then((data) => {
      const threadTitle = document.getElementById("thread-detail-title");
      const threadName = document.getElementById("thread-detail-name");
      const threadTime = document.getElementById("thread-detail-time");
      const threadContent = document.getElementById("thread-content");
      const date = new Date(data.createdAt);
      threadTitle.textContent = data.title;
      threadContent.textContent = data.content;
      apiCallGet("user", token, `userId=${data.creatorId}`)
      .then((data) => {
        threadName.textContent = data.name;
      });
      threadTime.textContent = `created at ${date.toLocaleString()}`; 

      //like and watch
      let user = parseInt(localStorage.getItem("userId"), 10);
      if (data.likes.includes(user)) {
        threadLike.classList.add("icon-like");
      } else {
        threadLike.classList.remove("icon-like");
      }

      if (data.watchees.includes(user)) {
        threadWatch.classList.add("icon-watching");
      } else {
        threadWatch.classList.remove("icon-watching");
      }

      //renew thread list
      const temp = document.getElementById(`${id}-like-num`);
      temp.textContent = data.likes.length;

    });
  }

  newPosts.forEach(function(newPost) {
    newPost.addEventListener("click", function(e) {
      const threadTitle = document.getElementById("edit-thread-title");
      const threadContent = document.getElementById("edit-thread-content");
      const threadIsPrivate = document.getElementById("check-button");
  
      if (threadTitle.value.trim() === '') {
        alert("Title cannot be empty or just spaces!")
      } else if (threadContent.value.trim() === '') {
        alert("Content cannot be empty or just spaces!")
      } else {
        let body = {
          "title": threadTitle.value,
          "isPublic": !threadIsPrivate.checked,
          "content": threadContent.value
        };
        apiCallPost("thread", token, body)
        .then((data) => {
          setDetailPage(data.id);
          dContent.classList.remove("hidden-detail-status");          
          dContent.classList.add("hidden-new-status", "hidden-main-status", "hidden-edit-status");
          localStorage.setItem("isMainRemoved", 'true');
          localStorage.setItem("isNewRemoved", 'true');
          localStorage.setItem("isDetailRemoved", 'false');  
          localStorage.setItem("isEditRemoved", 'true');
        })
        .catch((error) => {
          console.log(error);
        })
      }
    });
  });

  //edit thread
  const editThreadButton = document.getElementById("thread-edit");
  const cancelEdit = document.getElementById("edit-cancel");
  const editPosts = document.querySelectorAll(".edit-post");

  editThreadButton.addEventListener("click", function(e) {
    dContent.classList.remove("hidden-edit-status");          
    dContent.classList.add("hidden-new-status", "hidden-main-status", "hidden-detail-status");
    localStorage.setItem("isMainRemoved", 'true');
    localStorage.setItem("isNewRemoved", 'true');
    localStorage.setItem("isDetailRemoved", 'true');  
    localStorage.setItem("isEditRemoved", 'false');

    const threadTitleEdit = document.getElementById("change-thread-title");
    const threadContentEdit = document.getElementById("change-thread-content");
    const threadIsPrivateEdit = document.getElementById("change-check-button");
    const editThreadId = localStorage.getItem("currentId");
    apiCallGet("thread", token, `id=${editThreadId}`)
    .then((data) => {
      threadTitleEdit.value = data.title;
      threadContentEdit.value = data.content;
      threadIsPrivateEdit.checked = !data.isPublic;
    });

  });

  cancelEdit.addEventListener("click", function(e) {
    dContent.classList.remove("hidden-main-status");
    dContent.classList.add("hidden-new-status", "hidden-detail-status", "hidden-edit-status");
    localStorage.setItem("isMainRemoved", 'false');
    localStorage.setItem("isNewRemoved", 'true');
    localStorage.setItem("isDetailRemoved", 'true');
    localStorage.setItem("isEditRemoved", 'true');
  });

  editPosts.forEach(function(editPost) {
    editPost.addEventListener("click", function(e) {
      const threadTitle = document.getElementById("change-thread-title");
      const threadContent = document.getElementById("change-thread-content");
      const threadIsPrivate = document.getElementById("change-check-button");
  
      if (threadTitle.value.trim() === '') {
        alert("Title cannot be empty or just spaces!")
      } else if (threadContent.value.trim() === '') {
        alert("Content cannot be empty or just spaces!")
      } else {
        let id = localStorage.getItem("currentId");
        let body = {
          "id": id,
          "title": threadTitle.value,
          "isPublic": !threadIsPrivate.checked,
          "lock": false,
          "content": threadContent.value
        };
        apiCallPut("thread", token, body)
        .then((data) => {
          setDetailPage(id);
          dContent.classList.remove("hidden-detail-status");          
          dContent.classList.add("hidden-new-status", "hidden-main-status", "hidden-edit-status");
          localStorage.setItem("isMainRemoved", 'true');
          localStorage.setItem("isNewRemoved", 'true');
          localStorage.setItem("isDetailRemoved", 'false');  
          localStorage.setItem("isEditRemoved", 'true');
        })
        .catch((error) => {
          console.log(error);
        })
      }
    });
  });

  //delete thread
  const deleteThread = document.getElementById("thread-delete");
  deleteThread.addEventListener("click", function(e) {
    let id = localStorage.getItem("currentId");
    apiCallDelete("thread", token, {"id": id})
    .then((data) => {
      dContent.classList.remove("hidden-main-status");          
      dContent.classList.add("hidden-new-status", "hidden-detail-status", "hidden-edit-status");
      localStorage.setItem("isMainRemoved", 'false');
      localStorage.setItem("isNewRemoved", 'true');
      localStorage.setItem("isDetailRemoved", 'true');  
      localStorage.setItem("isEditRemoved", 'true');
    });
    const remItem = document.getElementById(`${id}`);
    remItem.remove();
  });


  //like thread, watch thread
  const threadLike = document.getElementById("thread-like");
  const threadWatch = document.getElementById("thread-watch");

  threadLike.addEventListener("click", function(e) {
    let id = localStorage.getItem("currentId");
    let body = {
      "id": id,
      "turnon": threadLike.classList.contains('icon-like') ? false : true
    }
    apiCallPut("thread/like", token, body)
    .then((data) => {
      setDetailPage(id);
    });
  });

  threadWatch.addEventListener("click", function(e) {
    let id = localStorage.getItem("currentId");
    let body = {
      "id": id,
      "turnon": threadWatch.classList.contains('icon-watching') ? false : true
    }
    apiCallPut("thread/watch", token, body)
    .then((data) => {
      setDetailPage(id);
    });
  });
});




