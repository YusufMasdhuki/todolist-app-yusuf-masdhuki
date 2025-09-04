import Hero from './home/partials/hero';
import SearchBar from './home/partials/search-bar';
import TodoListTabs from './home/partials/todo-list-tabs';

export default function Home() {
  return (
    <div className='mx-auto max-w-[650px] px-4 py-6 md:py-10 lg:py-26'>
      <Hero />
      <SearchBar />
      <TodoListTabs />
    </div>
  );
}
