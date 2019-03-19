const todoFilter = (todosObj, userId) => {
  const todosPerPerson = [];
  const todoKeys = Object.keys(todosObj);
  todoKeys.forEach(key => {
    todosObj[key].forEach(obj => {
      if (obj.userId === userId) {
        todosPerPerson.push(key);
      }
    });
  });
  return todosPerPerson;
};
