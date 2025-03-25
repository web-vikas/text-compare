import CodeDiff from "./code-diff"

export default function DiffExample() {
  const oldCode = [
    "Route::group(['prefix' => 'student'], function () {",
    "  Route::any('/', [StudentController::class, 'anyIndex'])->name('student.index');",
    "  Route::any('invite', [StudentController::class, 'anyInvite'])->name('student.signup');",
    "  Route::view('terms-of-service', 'student/termsofuse')->name('student.terms');",
    "}",
  ]

  const newCode = [
    "Route::group(['prefix' => 'student'], function () {",
    "  Route::get('/', [StudentController::class, 'anyIndex'])->name('student.index');",
    "  Route::get('invite', [StudentController::class, 'anyInvite'])->name('student.signup');",
    "  Route::view('terms-of-service', 'student/termsofuse')->name('student.terms');",
    "}",
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Code Diff Example</h1>
      <CodeDiff oldCode={oldCode} newCode={newCode} showLineNumbers={true} title="Route Changes" />
    </div>
  )
}

