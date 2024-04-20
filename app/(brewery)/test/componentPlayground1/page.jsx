/**
 * Testing for Brew Crafters
 *
 */

function ComponentPlayground1() {
  return (
    <div className="border rounded-lg border-slate-800">
      <div>
        <h2>Palgroud</h2>
      </div>
      <h2 className="mt-8">Hello Playground - Notice the margin from layout</h2>

      <div className="flex flex-col gap-2 md:flex-row">
        <div className="bg-pink-300 rounded-lg md:w-1/3">01 - flex flex-col gap-2 md:flex-row</div>
        <div className="bg-pink-400 rounded-lg md:w-1/3">02</div>
        <div className="bg-pink-500 rounded-lg md:w-1/3">03</div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <div className="bg-pink-400 rounded-lg">02 - flex flex-col gap-2 mt-4</div>
        <div className="bg-pink-300 rounded-lg">01 - flex flex-col gap-2 mt-4</div>
        <div className="bg-pink-500 rounded-lg">03 - flex flex-col gap-2 mt-4</div>
      </div>

      <div className="flex flex-col flex-auto md:flex-row border border-red-500 p-2 mt-4">
        <div className="md:w-1/4 bg-primary">bg-primary</div>
        <div className="md:w-1/4 bg-secondary">bg-secondary</div>
        <div className="md:w-1/4 bg-accent">bg-accent</div>
        <div className="md:w-1/4 bg-accent-content text-error">bg-accent-content</div>
        <div className="md:w-1/4 bg-accent text-primary-content">bg-accent-content</div>
      </div>
      <div className="flex flex-col md:flex-row border border-red-500">
        <div className="md:w-1/2 bg-primary m-4">Margin 4</div>
        <div className="md:w-1/2 bg-secondary p-4">Padding 4</div>
      </div>
      <div className="flex flex-col border border-red-400 mt-4">
        <h1 className="break-after-all">Header text </h1>

        <textarea className="textarea textarea-bordered" placeholder="Bio"></textarea>
      </div>
    </div>
  );
}

export default ComponentPlayground1;
