import React from "react";

const App = () => {
  const initialStories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1
    }
  ];

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [stories, setStories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const searchedStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getAsyncStories = () =>
    Promise.resolve({ data: { stories: initialStories } });

  React.useEffect(() => {
    setIsLoading(true);
    getAsyncStories()
      .then(result => {
        setStories(result.data.stories);
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, []);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveStory = item => {
    const newStories = stories.filter(
      story => item.objectID !== story.objectID
    );
    setStories(newStories);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <p>
        Searching for <strong>{searchTerm}</strong>.
      </p>
      <hr />
      {isError && <p>Something went wrong ...</p>}
      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue];
};

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  children
}) => (
  <>
    <label htmlFor={id}>{children}</label>
    &nbsp;
    <input id={id} type={type} value={value} onChange={onInputChange} />
  </>
);

const List = ({ list, onRemoveItem }) =>
  list.map(item => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ));

const Item = ({ item, onRemoveItem }) => {
  const handleRemoveItem = () => onRemoveItem(item);

  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={handleRemoveItem}>
          Dismiss
        </button>
      </span>
    </div>
  );
};

export default App;
