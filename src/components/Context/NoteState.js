import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const userId = localStorage.getItem("userId");
  const host = "http://localhost:5000";

  const getbooks = async () => {
    const response = await fetch(`${host}/api/books/fetchallbooks?userId=${userId}`, {
      method: "GET",

      headers: {
         "Content-Type": "application/json",
         "auth-token": localStorage.getItem("token"),
                },
    });
    const data = await response.json();
   // Check the data structure
    return data;
  };
  // const borrowedBooks = async (id) => {
  //   const response = await fetch(`${host}/api/books/${id}`, {
  //     method: "GET",

  //     headers: {
  //       "Content-Type": "application/json",
       
  //               },
  //   });
  //   const data = await response.json();
  //   console.log(data); // Check the data structure
  //   return data;
  // };

  return (
    <NoteContext.Provider value={{ getbooks  }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
