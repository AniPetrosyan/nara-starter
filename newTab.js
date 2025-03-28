document.addEventListener("DOMContentLoaded", () => {
  const backgroundContainer = document.createElement("div");
  backgroundContainer.className = "background-container";
  document.body.appendChild(backgroundContainer);

  const categoriesContainer = document.getElementById("categories-container");
  const tasksContainer = document.getElementById("tasks-container");
  const taskList = document.getElementById("task-list");
  const resetButton = document.getElementById("reset-button");
  const resetModal = document.getElementById("reset-modal");
  const resetYesButton = document.getElementById("reset-yes");
  const resetNoButton = document.getElementById("reset-no");

  // for controlling when hovers are active
  let hoverListeners = [];

  // Initial background image with 5 deers
  const initialBackground = "assets/original.jpg";

  // Background images for each category
  const backgroundSets = {
    daily: [
      "assets/A.png",
      "assets/A1.png",
      "assets/A2.png",
      "assets/A3.png",
      "assets/A4.png",
      "assets/A5.png",
    ],
    home: [
      "assets/B.png",
      "assets/B1.png",
      "assets/B2.png",
      "assets/B3.png",
      "assets/B4.png",
      "assets/B5.png",
    ],
    pet: [
      "assets/C.png",
      "assets/C1.png",
      "assets/C2.png",
      "assets/C3.png",
      "assets/C4.png",
      "assets/C5.png",
    ],
    friends: [
      "assets/D.png",
      "assets/D1.png",
      "assets/D2.png",
      "assets/D3.png",
      "assets/D4.png",
      "assets/D5.png",
    ],
    mind: [
      "assets/E.png",
      "assets/E1.png",
      "assets/E2.png",
      "assets/E3.png",
      "assets/E4.png",
      "assets/E5.png",
    ],
    others: [
      "assets/F.png",
      "assets/F1.png",
      "assets/F2.png",
      "assets/F3.png",
      "assets/F4.png",
      "assets/F5.png",
    ],
  };

  // Hover effect logic
  const deerAreas = [
    {
      id: "deer1",
      top: 530,
      left: 400,
      width: 150,
      height: 250,
      circleImage: "assets/circle_selfcare.png",
      category: "daily",
    },
    {
      id: "deer2",
      top: 570,
      left: 1510,
      width: 100,
      height: 200,
      circleImage: "assets/circle_lovedones.png",
      category: "friends",
    },
    {
      id: "deer3",
      top: 630,
      left: 1310,
      width: 100,
      height: 200,
      circleImage: "assets/circle_pets.png",
      category: "pet",
    },
    {
      id: "deer4",
      top: 540,
      left: 800,
      width: 120,
      height: 220,
      circleImage: "assets/circle_thehome.png",
      category: "home",
    },
    {
      id: "deer5",
      top: 600,
      left: 1150,
      width: 90,
      height: 160,
      circleImage: "assets/circle_themind.png",
      category: "mind",
    },
    {
      id: "deer6", // Unique ID for the new hover area
      top: 30, // Adjust the top position to place it in the top right-hand corner
      left: 1280, // Adjust the left position to place it in the top right-hand corner
      width: 150, // Adjust the width of the hover area
      height: 150, // Adjust the height of the hover area
      circleImage: "assets/circle_somethingelse.png", // New image for the hover area
      category: "others", // Link to the "Others" category
    },
  ];

  function removeAllListeners() {
    hoverListeners.forEach((listener) => {
      document.removeEventListener("mousemove", listener);
      document.removeEventListener("click", listener);
    });
    hoverListeners = [];
  }

  deerAreas.forEach((area) => {
    const circle = document.getElementById(`${area.id}-circle`);
    circle.style.backgroundImage = `url(${area.circleImage})`;

    const circleWidth = getComputedStyle(circle).width || "200px";
    const size = parseInt(circleWidth);
    circle.style.left = `${area.left + area.width / 2 - size / 2}px`;
    circle.style.top = `${area.top + area.height / 2 - size / 2}px`;

    const checkHover = (e) => {
      const mouseX = e.pageX;
      const mouseY = e.pageY;

      if (
        mouseX >= area.left &&
        mouseX <= area.left + area.width &&
        mouseY >= area.top &&
        mouseY <= area.top + area.height
      ) {
        circle.classList.add("active");
      } else {
        circle.classList.remove("active");
      }
    };

    // Store listener reference for later removal
    hoverListeners.push(checkHover);
    document.addEventListener("mousemove", checkHover);

    const handleClick = (e) => {
      if (!circle.classList.contains("hidden")) {
        // Only handle clicks when circles are visible
        const mouseX = e.pageX;
        const mouseY = e.pageY;

        if (
          mouseX >= area.left &&
          mouseX <= area.left + area.width &&
          mouseY >= area.top &&
          mouseY <= area.top + area.height
        ) {
          const categoryButton = document.querySelector(
            `.category-button[data-category="${area.category}"]`
          );
          if (categoryButton) {
            categoryButton.click();
            removeAllListeners(); // Remove listeners after category selection
          }
        }
      }
    };

    document.addEventListener("click", handleClick);
    hoverListeners.push(handleClick);
  });

  // Preload image function
  function preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = reject;
      img.src = url;
    });
  }

  // Function to change background with slide effect
  async function changeBackgroundWithSlide(newImageUrl) {
    try {
      // Preload the new image first
      await preloadImage(newImageUrl);

      return new Promise((resolve) => {
        const currentBg =
          backgroundContainer.querySelector(".background-slide");
        const newBg = document.createElement("div");
        newBg.className = "background-slide";

        // Set initial opacity to 0
        newBg.style.opacity = "0";
        newBg.style.backgroundImage = `url(${newImageUrl})`;

        // Add the new background
        backgroundContainer.appendChild(newBg);

        // Force a reflow to ensure the opacity transition works
        newBg.offsetHeight;

        // Fade in the new background
        requestAnimationFrame(() => {
          newBg.style.opacity = "1";

          if (currentBg) {
            // Start fading out the old background
            currentBg.style.opacity = "0";

            // Remove the old background after transition
            currentBg.addEventListener(
              "transitionend",
              () => {
                currentBg.remove();
                resolve();
              },
              { once: true }
            );
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error("Error loading image:", error);
      return Promise.resolve();
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Function to hide hover circles
  function hideHoverCircles() {
    const hoverCircles = document.querySelectorAll(".deer-circle");
    hoverCircles.forEach((circle) => {
      circle.classList.add("hidden");
    });
  }

  // Function to show hover circles
  function showHoverCircles() {
    const hoverCircles = document.querySelectorAll(".deer-circle");
    hoverCircles.forEach((circle) => {
      circle.classList.remove("hidden");
    });
  }

  // Updated hardcoded tasks with new categories and random selection
  const taskPool = {
    daily: [
      "Brush teeth for two minutes",
      "Take a relaxing shower",
      "Eat a yummy breakfast",
      "Go for a refreshing 20 minute walk",
      "Change into your favorite outfit",
      "Brush your beautiful hair",
      "Floss between all your teeth",
      "Drink three full glasses of water",
      "Eat a serving of fruits or vegetables",
      "Tidy up your bed",
      "Trim your nails",
      "Moisturize your face and body",
      "Take your medications or vitamins",
      "Put on sunscreen",
      "Take five minutes to shave",
    ],
    home: [
      "Wipe down kitchen counters and stove",
      "Vacuum your space",
      "Empty trash bins and replace bags",
      "Load or unload the dishwasher",
      "Make your bed",
      "Clean your bathroom sink, mirror, and toilet",
      "Sweep or mop the floors",
      "Stow away your clutter",
      "Wipe dining table and chairs",
      "Clean the inside of the microwave",
      "Sort mail and papers",
      "Water your plants",
      "Do a quick dusting of surfaces",
      "Put all your stray clothes in the hamper",
      "Organize your desk",
      "Do a load of laundry",
      "Wipe your electronic surfaces clean",
    ],
    pet: [
      "Provide fresh water in bowl",
      "Clean feeding area",
      "Brush fur",
      "Have dedicated playtime together",
      "Give healthy treats as rewards",
      "Monitor food and water intake",
      "Give pets attention and affection",
      "Check skin/coat for any abnormalities",
    ],
    friends: [
      "Send a thoughtful text message to someone you love",
      "Schedule a catch-up call/coffee",
      "Tell someone a nice compliment",
      "Wish someone a happy birthday today",
      "Give a meaningful compliment",
      "Share a memory/photo with someone",
      "Write a handwritten note",
      "Plan a meetup with some friends",
      "Send a short text to a friend you have not heard from lately",
      "Congratulate someone on a recent achievement",
    ],
    mind: [
      "Take 5 minutes to practice mindful breathing",
      "Write 3 things you are grateful for",
      "Listen to calming music",
      "Practice a 5 minute meditation",
      "Journal your current feelings down for ten minutes",
      "Read a chapter of your new book",
      "Follow a 10 minute stretching Youtube video",
      "Write down a list of 3 affirmations for yourself",
      "Organize one small space in your home",
      "Go outside for at least 20 minutes of fresh air",
      "Do one creative activity",
      "Practice Duolingo for 10 minutes",
    ],
  };

  // Function to get 5 random tasks from a category
  function getRandomTasks(category) {
    const tasks = taskPool[category];
    return shuffleArray([...tasks]).slice(0, 5).map(text => ({
      text,
      completed: false,
      dueDate: '',
      additionalInfo: ''
    }));
  }

  const hardcodedTasks = {
    daily: getRandomTasks("daily"),
    home: getRandomTasks("home"),
    pet: getRandomTasks("pet"),
    friends: getRandomTasks("friends"),
    mind: getRandomTasks("mind"),
  };

  let sortableInstance = null;

  // Load saved state from chrome.storage.local
  chrome.storage.local.get("state", (data) => {
    if (data.state) {
      const {
        tasks,
        backgroundIndex,
        categoriesHidden,
        isFinalImage,
        selectedCategory,
      } = data.state;

      if (isFinalImage) {
        changeBackgroundWithSlide(
          backgroundSets[selectedCategory][
            backgroundSets[selectedCategory].length - 1
          ]
        ).then(() => {
          tasksContainer.classList.add("hidden");
          categoriesContainer.classList.add("hidden");
          hideHoverCircles(); // Hide hover circles when the final image is shown
          document.getElementById("welcome-message").classList.add("hidden");

          // Create and show thank you message
          const thankYouMessage = document.createElement("div");
          thankYouMessage.className = "thank-you-message";
          thankYouMessage.textContent = "Thank you for taking good care of me";
          document.body.appendChild(thankYouMessage);
        });
      } else {
        renderTasks(tasks, backgroundIndex, selectedCategory);
        if (categoriesHidden) {
          categoriesContainer.classList.add("hidden");
          hideHoverCircles(); // Hide hover circles when categories are hidden
          document.getElementById("welcome-message").classList.add("hidden");
        }
        changeBackgroundWithSlide(
          backgroundSets[selectedCategory][backgroundIndex]
        );
      }
    } else {
      //categoriesContainer.classList.remove("hidden");
      document.getElementById("welcome-message").classList.remove("hidden");
      showHoverCircles(); // Show hover circles in the initial state
      changeBackgroundWithSlide(initialBackground);
    }
  });

  categoriesContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("category-button")) {
      const category = event.target.dataset.category;
      hideHoverCircles();

      if (category === "others") {
        // Create five empty tasks for the "Others" category
        const tasks = Array(5)
          .fill()
          .map(() => ({
            text: "",
            completed: false,
            dueDate: "",
            additionalInfo: ""
          }));

        chrome.storage.local.set({
          state: {
            tasks,
            backgroundIndex: 0,
            categoriesHidden: true,
            isFinalImage: false,
            selectedCategory: category,
          },
        });

        // Set the background to the category's origin photo (e.g., A.jpg)
        changeBackgroundWithSlide(backgroundSets[category][0]).then(() => {
          // Render the empty tasks
          renderTasks(tasks, 0, category);
        });
      } else {
        const tasks = hardcodedTasks[category];
        chrome.storage.local.set({
          state: {
            tasks,
            backgroundIndex: 0,
            categoriesHidden: true,
            isFinalImage: false,
            selectedCategory: category,
          },
        });
        // Set the background to the category's origin photo (e.g., A.jpg)
        changeBackgroundWithSlide(backgroundSets[category][0]).then(() => {
          renderTasks(tasks, 0, category);
        });
      }

      categoriesContainer.classList.add("hidden");
      hideHoverCircles();
      document.getElementById("welcome-message").classList.add("hidden");
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateSubtasks") {
      const tasks = message.subtasks.map((task) => ({
        text: task,
        completed: false,
      }));
      chrome.storage.local.set({
        state: {
          tasks,
          backgroundIndex: 0,
          categoriesHidden: true,
          isFinalImage: false,
          selectedCategory: "others",
        },
      });
      renderTasks(tasks, 0, "self");
    }
  });

  // Show the reset modal when the reset button is clicked
  resetButton.addEventListener("click", () => {
    resetModal.classList.remove("hidden");
  });

  // Hide the reset modal when "No" is clicked
  resetNoButton.addEventListener("click", () => {
    resetModal.classList.add("hidden");
  });

  // Reset everything when "Yes" is clicked
  resetYesButton.addEventListener("click", () => {
    // Clear the state in chrome.storage.local
    chrome.storage.local.set({ state: null }, () => {
      console.log("State reset to initial state.");
    });

    // Reset the UI to the initial state
    tasksContainer.classList.add("hidden");
    document.getElementById("welcome-message").classList.remove("hidden");
    changeBackgroundWithSlide(initialBackground);

    // Remove thank you message if it exists
    const thankYouMessage = document.querySelector(".thank-you-message");
    if (thankYouMessage) {
      thankYouMessage.remove();
    }

    // Reattach hover listeners
    deerAreas.forEach((area) => {
      const circle = document.getElementById(`${area.id}-circle`);

      const checkHover = (e) => {
        const mouseX = e.pageX;
        const mouseY = e.pageY;

        if (
          mouseX >= area.left &&
          mouseX <= area.left + area.width &&
          mouseY >= area.top &&
          mouseY <= area.top + area.height
        ) {
          circle.classList.add("active");
        } else {
          circle.classList.remove("active");
        }
      };

      const handleClick = (e) => {
        if (!circle.classList.contains("hidden")) {
          const mouseX = e.pageX;
          const mouseY = e.pageY;

          if (
            mouseX >= area.left &&
            mouseX <= area.left + area.width &&
            mouseY >= area.top &&
            mouseY <= area.top + area.height
          ) {
            const categoryButton = document.querySelector(
              `.category-button[data-category="${area.category}"]`
            );
            if (categoryButton) {
              categoryButton.click();
              removeAllListeners();
            }
          }
        }
      };

      document.addEventListener("mousemove", checkHover);
      document.addEventListener("click", handleClick);
      hoverListeners.push(checkHover, handleClick);
      circle.classList.remove("hidden");
    });

    // Hide the reset modal
    resetModal.classList.add("hidden");
  });

  function updateBackgroundState(tasks, selectedCategory) {
    const tasksWithContent = tasks.filter((task) => task.text.trim() !== "");
    const completedTasks = tasks.filter(
      (task) => task.completed && task.text.trim() !== ""
    ).length;
    const totalTasksWithContent = tasksWithContent.length;

    let backgroundIndex;
    let isFinalImage = false;

    if (selectedCategory === "others") {
      // For "others" category, increment background based on completed tasks
      backgroundIndex = Math.min(
        completedTasks,
        backgroundSets[selectedCategory].length - 2
      );

      // Only show final image when ALL tasks with content are completed
      if (
        completedTasks === totalTasksWithContent &&
        totalTasksWithContent > 0
      ) {
        backgroundIndex = backgroundSets[selectedCategory].length - 1;
        isFinalImage = true;
      }
    } else {
      // Original logic for other categories
      if (
        completedTasks === totalTasksWithContent &&
        totalTasksWithContent > 0
      ) {
        backgroundIndex = backgroundSets[selectedCategory].length - 1;
        isFinalImage = true;
      } else {
        backgroundIndex = Math.min(
          completedTasks,
          backgroundSets[selectedCategory].length - 1
        );
      }
    }

    return { backgroundIndex, isFinalImage };
  }

  function sortTasksByCompletion(tasks) {
    return [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? -1 : 1;
    });
  }

  // Gratitude Log functionality
  const gratitudeContainer = document.getElementById("gratitude-container");
  const gratitudeInput = document.getElementById("gratitude-input");
  const saveGratitudeBtn = document.getElementById("save-gratitude");
  const viewGratitudeLogBtn = document.getElementById("view-gratitude-log");
  const gratitudeModal = document.getElementById("gratitude-modal");
  const gratitudeEntries = document.getElementById("gratitude-entries");
  const closeGratitudeLogBtn = document.getElementById("close-gratitude-log");

  // Show gratitude container when tasks are shown
  const originalRenderTasks = renderTasks;
  renderTasks = function(tasks, backgroundIndex, category) {
    originalRenderTasks(tasks, backgroundIndex, category);
    gratitudeContainer.classList.remove("hidden");
  };

  // Save gratitude entry
  saveGratitudeBtn.addEventListener("click", () => {
    const gratitudeText = gratitudeInput.value.trim();
    if (!gratitudeText) return;

    const entry = {
      text: gratitudeText,
      date: new Date().toISOString()
    };

    chrome.storage.local.get("gratitudeLog", (data) => {
      const gratitudeLog = data.gratitudeLog || [];
      gratitudeLog.unshift(entry);
      chrome.storage.local.set({ gratitudeLog }, () => {
        gratitudeInput.value = "";
        // Show a brief success message
        saveGratitudeBtn.textContent = "Saved!";
        setTimeout(() => {
          saveGratitudeBtn.textContent = "Save";
        }, 1500);
      });
    });
  });

  // View gratitude log
  viewGratitudeLogBtn.addEventListener("click", () => {
    chrome.storage.local.get("gratitudeLog", (data) => {
      const gratitudeLog = data.gratitudeLog || [];
      gratitudeEntries.innerHTML = gratitudeLog.map(entry => `
        <div class="gratitude-entry">
          <div class="gratitude-entry-date">${new Date(entry.date).toLocaleDateString()}</div>
          <div class="gratitude-entry-text">${entry.text}</div>
        </div>
      `).join("");
      gratitudeModal.classList.remove("hidden");
    });
  });

  // Close gratitude log modal
  closeGratitudeLogBtn.addEventListener("click", () => {
    gratitudeModal.classList.add("hidden");
  });

  // Hide gratitude container when resetting
  const originalResetYesHandler = resetYesButton.onclick;
  resetYesButton.onclick = () => {
    if (originalResetYesHandler) originalResetYesHandler();
    gratitudeContainer.classList.add("hidden");
  };

  function renderTasks(tasks, backgroundIndex, category) {
    tasksContainer.classList.remove("hidden");
    gratitudeContainer.classList.remove("hidden");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.className = "draggable";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      const taskText = document.createElement("div");
      taskText.className = "task-text";
      taskText.contentEditable = true;
      taskText.textContent = task.text;
      if (category === "others") {
        taskText.setAttribute("placeholder", "Enter your task here");
      }

      const infoButton = document.createElement("button");
      infoButton.className = "task-info-button";
      infoButton.innerHTML = "ⓘ";
      infoButton.title = "Add date/notes";

      const infoContainer = document.createElement("div");
      infoContainer.className = "task-info-container";
      
      const dateLabel = document.createElement("label");
      dateLabel.className = "input-label";
      dateLabel.textContent = "Due Date";
      
      const dateInput = document.createElement("input");
      dateInput.type = "date";
      dateInput.className = "task-date-input";
      dateInput.value = task.dueDate || '';
      
      const notesLabel = document.createElement("label");
      notesLabel.className = "input-label";
      notesLabel.textContent = "Notes";
      
      const additionalInfoInput = document.createElement("input");
      additionalInfoInput.type = "text";
      additionalInfoInput.className = "task-info-input";
      additionalInfoInput.placeholder = "Add notes...";
      additionalInfoInput.value = task.additionalInfo || '';

      infoContainer.appendChild(dateLabel);
      infoContainer.appendChild(dateInput);
      infoContainer.appendChild(notesLabel);
      infoContainer.appendChild(additionalInfoInput);

      // Save changes when inputs are modified
      dateInput.addEventListener("change", () => {
        task.dueDate = dateInput.value;
        saveTaskState(tasks, category, backgroundIndex);
      });

      additionalInfoInput.addEventListener("input", () => {
        task.additionalInfo = additionalInfoInput.value;
        saveTaskState(tasks, category, backgroundIndex);
      });

      // Toggle info container with smooth animation
      infoButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasHidden = !infoContainer.classList.contains("show");
        
        // Hide all other open info containers first
        document.querySelectorAll(".task-info-container.show").forEach(container => {
          if (container !== infoContainer) {
            container.classList.remove("show");
          }
        });

        if (wasHidden) {
          // Position the container properly before showing
          const taskRect = taskItem.getBoundingClientRect();
          infoContainer.style.top = `${taskRect.height / 2}px`;
          infoContainer.classList.add("show");
          
          // Focus the date input when opening
          setTimeout(() => dateInput.focus(), 300);
        } else {
          infoContainer.classList.remove("show");
        }
      });

      // Click outside to close with smooth animation
      document.addEventListener("click", (e) => {
        if (!infoContainer.contains(e.target) && !infoButton.contains(e.target)) {
          infoContainer.classList.remove("show");
        }
      });

      checkbox.addEventListener("change", () => {
        const originalIndex = tasks.indexOf(task);
        tasks[originalIndex].completed = checkbox.checked;

        let newPosition = 0;
        if (checkbox.checked) {
          newPosition = tasks.filter(
            (t, i) => t.completed && i < originalIndex
          ).length;
        } else {
          newPosition = tasks.filter((t) => t.completed).length;
        }

        chrome.storage.local.get("tasks", (data) => {
          const allTasks = data.tasks || {};
          allTasks[category] = allTasks[category] || [];
          const taskIndex = allTasks[category].findIndex(t => t.text === task.text);
          
          if (taskIndex !== -1) {
            allTasks[category][taskIndex].completed = task.completed;
            chrome.storage.local.set({ tasks: allTasks }, () => {
              const { backgroundIndex, isFinalImage } = updateBackgroundState(tasks, category);
              saveTaskState(tasks, category, backgroundIndex, isFinalImage);

            if (isFinalImage) {
                tasksContainer.classList.add("hidden");
                gratitudeContainer.classList.add("hidden");
                const thankYouMessage = document.createElement("div");
                thankYouMessage.className = "thank-you-message";
                thankYouMessage.textContent = "Thank you for taking good care of me";
                document.body.appendChild(thankYouMessage);
              }

            renderTasks(tasks, backgroundIndex, category);
              changeBackgroundWithSlide(backgroundSets[category][backgroundIndex]);
            });
          }
        });
      });

      taskText.addEventListener("input", () => {
        const originalIndex = tasks.indexOf(task);
        tasks[originalIndex].text = taskText.textContent;

        chrome.storage.local.get("tasks", (data) => {
          const allTasks = data.tasks || {};
          allTasks[category] = tasks;
          chrome.storage.local.set({ tasks: allTasks }, () => {
            const { backgroundIndex, isFinalImage } = updateBackgroundState(tasks, category);
            saveTaskState(tasks, category, backgroundIndex, isFinalImage);
          });
        });
      });

      taskItem.appendChild(checkbox);
      taskItem.appendChild(taskText);
      if (!task.completed) {
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-task";
        deleteButton.addEventListener("click", () => {
          tasks.splice(tasks.indexOf(task), 1);
          renderTasks(tasks, backgroundIndex, category);

          chrome.storage.local.get("tasks", (data) => {
            const allTasks = data.tasks || {};
            allTasks[category] = tasks;
            chrome.storage.local.set({ tasks: allTasks });
          });

          const { backgroundIndex: newIndex, isFinalImage } = updateBackgroundState(tasks, category);
          chrome.storage.local.set({
            state: {
              tasks,
              backgroundIndex: newIndex,
              categoriesHidden: true,
              isFinalImage,
              selectedCategory: category,
            },
          });
        });
        taskItem.appendChild(deleteButton);
      }
      taskItem.appendChild(infoButton);

      // Create drag handle
      const dragHandle = document.createElement("div");
      dragHandle.className = "drag-handle";
      for (let i = 0; i < 3; i++) {
        const line = document.createElement("div");
        line.className = "line";
        dragHandle.appendChild(line);
      }

      taskItem.appendChild(dragHandle);
      taskItem.appendChild(infoContainer);
      taskList.appendChild(taskItem);
    });

    if (sortableInstance) {
      sortableInstance.destroy();
    }

    sortableInstance = new Sortable(taskList, {
      animation: 150,
      handle: ".drag-handle",
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
    });
  }

  function saveTaskState(tasks, category, backgroundIndex, isFinalImage = false) {
        chrome.storage.local.set({
          state: {
            tasks,
        backgroundIndex,
            categoriesHidden: true,
            isFinalImage,
            selectedCategory: category,
          },
        });
  }

  function showSaveIndicator(indicator) {
    indicator.classList.add("visible");
    setTimeout(() => {
      indicator.classList.remove("visible");
    }, 1500);
  }
});
