// Interactive examples for the project page: the Figure 1 scene and one Active-setting question per task,
// with the trajectories recorded for three models in our evaluation.
window.SATE_DEMO = [
  {
    "id": "figure1",
    "kind": "teaser",
    "tab": "Figure 1 example",
    "task": "Figure 1 illustration",
    "dataset": "HOI-M3",
    "question": "Is there a person wearing a gray T-shirt and holding a book sitting at the other side of the bed, further away from the crowd?",
    "options": {
      "A": "Yes",
      "B": "No"
    },
    "answer": "A",
    "numViews": 8,
    "initView": 7,
    "images": [
      "static/demo/figure1/view_1.jpg",
      "static/demo/figure1/view_2.jpg",
      "static/demo/figure1/view_3.jpg",
      "static/demo/figure1/view_4.jpg",
      "static/demo/figure1/view_5.jpg",
      "static/demo/figure1/view_6.jpg",
      "static/demo/figure1/view_7.jpg",
      "static/demo/figure1/view_8.jpg"
    ],
    "reference": {
      "views": [
        7,
        8,
        1
      ],
      "answer": "A"
    }
  },
  {
    "id": "q141",
    "kind": "benchmark",
    "index": 141,
    "tab": "Human Counting",
    "task": "Human Counting",
    "dataset": "HOI-M3",
    "question": "How many unique people are present in the scene across all provided views?",
    "options": {
      "A": "The queried entity does not exist or is not visible, or the provided images are insufficient to answer the question.",
      "B": "4",
      "C": "5",
      "D": "7",
      "E": "6"
    },
    "answer": "C",
    "numViews": 8,
    "initView": 8,
    "images": [
      "static/demo/q141/view_1.jpg",
      "static/demo/q141/view_2.jpg",
      "static/demo/q141/view_3.jpg",
      "static/demo/q141/view_4.jpg",
      "static/demo/q141/view_5.jpg",
      "static/demo/q141/view_6.jpg",
      "static/demo/q141/view_7.jpg",
      "static/demo/q141/view_8.jpg"
    ],
    "models": [
      {
        "name": "Gemini-3.5-flash",
        "views": [
          8,
          7
        ],
        "answer": "C",
        "correct": true
      },
      {
        "name": "GPT-5.2",
        "views": [
          8
        ],
        "answer": "B",
        "correct": false
      },
      {
        "name": "Qwen3-VL-8B-Instruct",
        "views": [
          8,
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ],
        "answer": null,
        "correct": false
      }
    ]
  },
  {
    "id": "q108",
    "kind": "benchmark",
    "index": 108,
    "tab": "Object Counting",
    "task": "Object Counting",
    "dataset": "core4D",
    "question": "How many glass doors can be seen in the scene?",
    "options": {
      "A": "3",
      "B": "The queried entity does not exist or is not visible, or the provided images are insufficient to answer the question.",
      "C": "2",
      "D": "1",
      "E": "4"
    },
    "answer": "C",
    "numViews": 4,
    "initView": 3,
    "images": [
      "static/demo/q108/view_1.jpg",
      "static/demo/q108/view_2.jpg",
      "static/demo/q108/view_3.jpg",
      "static/demo/q108/view_4.jpg"
    ],
    "models": [
      {
        "name": "Gemini-3.5-flash",
        "views": [
          3,
          2,
          1,
          4
        ],
        "answer": "C",
        "correct": true
      },
      {
        "name": "GPT-5.2",
        "views": [
          3,
          2,
          3
        ],
        "answer": "D",
        "correct": false
      },
      {
        "name": "Qwen3-VL-8B-Instruct",
        "views": [
          3
        ],
        "answer": "B",
        "correct": false
      }
    ]
  },
  {
    "id": "q15",
    "kind": "benchmark",
    "index": 15,
    "tab": "Action & Pose",
    "task": "Fine-grained Action and Pose",
    "dataset": "HOI-M3",
    "question": "What specific action is the woman in the grey sweatshirt performing with the purple dumbbell on the table?",
    "options": {
      "A": "Touching the top weight plate of the purple dumbbell with her right palm",
      "B": "Lifting the purple dumbbell off the table with her left hand",
      "C": "Grasping the central handle of the purple dumbbell with her right hand",
      "D": "The queried entity does not exist or is not visible, or the provided images are insufficient to answer the question.",
      "E": "Grasping the central handle of the purple dumbbell with her left hand"
    },
    "answer": "C",
    "numViews": 8,
    "initView": 6,
    "images": [
      "static/demo/q15/view_1.jpg",
      "static/demo/q15/view_2.jpg",
      "static/demo/q15/view_3.jpg",
      "static/demo/q15/view_4.jpg",
      "static/demo/q15/view_5.jpg",
      "static/demo/q15/view_6.jpg",
      "static/demo/q15/view_7.jpg",
      "static/demo/q15/view_8.jpg"
    ],
    "models": [
      {
        "name": "Gemini-3.5-flash",
        "views": [
          6,
          5,
          4
        ],
        "answer": "C",
        "correct": true
      },
      {
        "name": "GPT-5.2",
        "views": [
          6,
          5
        ],
        "answer": "D",
        "correct": false
      },
      {
        "name": "Qwen3-VL-8B-Instruct",
        "views": [
          6
        ],
        "answer": "D",
        "correct": false
      }
    ]
  },
  {
    "id": "q523",
    "kind": "benchmark",
    "index": 523,
    "tab": "Human-Object Interaction",
    "task": "Human-Object Interaction",
    "dataset": "HOI-M3",
    "question": "Which specific part of the woman in the grey hoodie is in physical contact with the frying pan?",
    "options": {
      "A": "The woman's left hand is gripping the handle of the frying pan",
      "B": "The woman's two hands are gripping the handle of the frying pan",
      "C": "The woman's right hand is gripping the handle of the frying pan, while the left hand is gripping the rim",
      "D": "The woman's right hand is gripping the handle of the frying pan",
      "E": "The queried entity does not exist or is not visible, or the provided images are insufficient to answer the question."
    },
    "answer": "D",
    "numViews": 8,
    "initView": 2,
    "images": [
      "static/demo/q523/view_1.jpg",
      "static/demo/q523/view_2.jpg",
      "static/demo/q523/view_3.jpg",
      "static/demo/q523/view_4.jpg",
      "static/demo/q523/view_5.jpg",
      "static/demo/q523/view_6.jpg",
      "static/demo/q523/view_7.jpg",
      "static/demo/q523/view_8.jpg"
    ],
    "models": [
      {
        "name": "Gemini-3.5-flash",
        "views": [
          2,
          3,
          4
        ],
        "answer": "D",
        "correct": true
      },
      {
        "name": "GPT-5.2",
        "views": [
          2,
          1
        ],
        "answer": "E",
        "correct": false
      },
      {
        "name": "Qwen3-VL-8B-Instruct",
        "views": [
          2
        ],
        "answer": "E",
        "correct": false
      }
    ]
  },
  {
    "id": "q707",
    "kind": "benchmark",
    "index": 707,
    "tab": "Human Existence",
    "task": "Human Existence",
    "dataset": "Replay",
    "question": "Is there a person wearing a pink shirt and a surgical mask standing in the kitchen area near a refrigerator?",
    "options": {
      "A": "Yes",
      "B": "No"
    },
    "answer": "A",
    "numViews": 8,
    "initView": 1,
    "images": [
      "static/demo/q707/view_1.jpg",
      "static/demo/q707/view_2.jpg",
      "static/demo/q707/view_3.jpg",
      "static/demo/q707/view_4.jpg",
      "static/demo/q707/view_5.jpg",
      "static/demo/q707/view_6.jpg",
      "static/demo/q707/view_7.jpg",
      "static/demo/q707/view_8.jpg"
    ],
    "models": [
      {
        "name": "Gemini-3.5-flash",
        "views": [
          1,
          2
        ],
        "answer": "A",
        "correct": true
      },
      {
        "name": "GPT-5.2",
        "views": [
          1,
          8
        ],
        "answer": "B",
        "correct": false
      },
      {
        "name": "Qwen3-VL-8B-Instruct",
        "views": [
          1
        ],
        "answer": "B",
        "correct": false
      }
    ]
  },
  {
    "id": "q764",
    "kind": "benchmark",
    "index": 764,
    "tab": "Object Existence",
    "task": "Object Existence",
    "dataset": "core4D",
    "question": "Is there a long wooden stick near the green wall?",
    "options": {
      "A": "Yes",
      "B": "No"
    },
    "answer": "A",
    "numViews": 4,
    "initView": 3,
    "images": [
      "static/demo/q764/view_1.jpg",
      "static/demo/q764/view_2.jpg",
      "static/demo/q764/view_3.jpg",
      "static/demo/q764/view_4.jpg"
    ],
    "models": [
      {
        "name": "Gemini-3.5-flash",
        "views": [
          3,
          4,
          1
        ],
        "answer": "A",
        "correct": true
      },
      {
        "name": "GPT-5.2",
        "views": [
          3,
          2
        ],
        "answer": "B",
        "correct": false
      },
      {
        "name": "Qwen3-VL-8B-Instruct",
        "views": [
          3
        ],
        "answer": "B",
        "correct": false
      }
    ]
  },
  {
    "id": "q64",
    "kind": "benchmark",
    "index": 64,
    "tab": "Distance to Human",
    "task": "Relative Distance to Human",
    "dataset": "EgoHumans",
    "question": "Which person is physically closest to the person in the black hoodie?",
    "options": {
      "A": "The person in the blue hoodie",
      "B": "The person in the striped shirt",
      "C": "The queried entity does not exist or is not visible, or the provided images are insufficient to answer the question.",
      "D": "The person in the blue puffer jacket",
      "E": "The person behind the furthest tripod"
    },
    "answer": "D",
    "numViews": 8,
    "initView": 2,
    "images": [
      "static/demo/q64/view_1.jpg",
      "static/demo/q64/view_2.jpg",
      "static/demo/q64/view_3.jpg",
      "static/demo/q64/view_4.jpg",
      "static/demo/q64/view_5.jpg",
      "static/demo/q64/view_6.jpg",
      "static/demo/q64/view_7.jpg",
      "static/demo/q64/view_8.jpg"
    ],
    "models": [
      {
        "name": "Gemini-3.5-flash",
        "views": [
          2,
          1
        ],
        "answer": "D",
        "correct": true
      },
      {
        "name": "GPT-5.2",
        "views": [
          2
        ],
        "answer": "C",
        "correct": false
      },
      {
        "name": "Qwen3-VL-8B-Instruct",
        "views": [
          2
        ],
        "answer": "C",
        "correct": false
      }
    ]
  },
  {
    "id": "q377",
    "kind": "benchmark",
    "index": 377,
    "tab": "Distance to Object",
    "task": "Relative Distance to Object",
    "dataset": "HOI-M3",
    "question": "Which person is sitting physically closest to the green checkered cube?",
    "options": {
      "A": "The woman in the grey shirt in the yellow armchair",
      "B": "The man in the navy shirt on the wooden chair",
      "C": "The man in the black hoodie leaning on the armchair",
      "D": "The man in the grey t-shirt on the bed",
      "E": "The queried entity does not exist or is not visible, or the provided images are insufficient to answer the question."
    },
    "answer": "A",
    "numViews": 8,
    "initView": 4,
    "images": [
      "static/demo/q377/view_1.jpg",
      "static/demo/q377/view_2.jpg",
      "static/demo/q377/view_3.jpg",
      "static/demo/q377/view_4.jpg",
      "static/demo/q377/view_5.jpg",
      "static/demo/q377/view_6.jpg",
      "static/demo/q377/view_7.jpg",
      "static/demo/q377/view_8.jpg"
    ],
    "models": [
      {
        "name": "Gemini-3.5-flash",
        "views": [
          4,
          3
        ],
        "answer": "A",
        "correct": true
      },
      {
        "name": "GPT-5.2",
        "views": [
          4
        ],
        "answer": "D",
        "correct": false
      },
      {
        "name": "Qwen3-VL-8B-Instruct",
        "views": [
          4
        ],
        "answer": "C",
        "correct": false
      }
    ]
  },
  {
    "id": "q870",
    "kind": "benchmark",
    "index": 870,
    "tab": "Depth Ordering",
    "task": "View-Specific Depth Ordering",
    "dataset": "HOI-M3",
    "question": "From the specific viewpoint of the man in the grey t-shirt, what is the depth ordering of the following three entities from closest to farthest?",
    "options": {
      "A": "Weight bench, man in brown t-shirt, woman in striped tank",
      "B": "Woman in striped tank, weight bench, man in brown t-shirt",
      "C": "Man in brown t-shirt, weight bench, woman in striped tank",
      "D": "The queried entity does not exist or is not visible, or the provided images are insufficient to answer the question.",
      "E": "Man in brown t-shirt, woman in striped tank, weight bench"
    },
    "answer": "C",
    "numViews": 8,
    "initView": 4,
    "images": [
      "static/demo/q870/view_1.jpg",
      "static/demo/q870/view_2.jpg",
      "static/demo/q870/view_3.jpg",
      "static/demo/q870/view_4.jpg",
      "static/demo/q870/view_5.jpg",
      "static/demo/q870/view_6.jpg",
      "static/demo/q870/view_7.jpg",
      "static/demo/q870/view_8.jpg"
    ],
    "models": [
      {
        "name": "Gemini-3.5-flash",
        "views": [
          4,
          3
        ],
        "answer": "C",
        "correct": true
      },
      {
        "name": "GPT-5.2",
        "views": [
          4
        ],
        "answer": "D",
        "correct": false
      },
      {
        "name": "Qwen3-VL-8B-Instruct",
        "views": [
          4
        ],
        "answer": "E",
        "correct": false
      }
    ]
  },
  {
    "id": "q56",
    "kind": "benchmark",
    "index": 56,
    "tab": "View-Specific Direction",
    "task": "View-Specific Direction",
    "dataset": "Harmony4D",
    "question": "From the perspective of the man sitting in the blue t-shirt, what is the 3D spatial relationship of the standing wrestler relative to the grounded wrestler's torso?",
    "options": {
      "A": "In front, to the right, and below",
      "B": "The queried entity does not exist or is not visible, or the provided images are insufficient to answer the question.",
      "C": "Behind, to the left, and below",
      "D": "In front, to the left, and above",
      "E": "Behind, to the right, and above"
    },
    "answer": "D",
    "numViews": 8,
    "initView": 3,
    "images": [
      "static/demo/q56/view_1.jpg",
      "static/demo/q56/view_2.jpg",
      "static/demo/q56/view_3.jpg",
      "static/demo/q56/view_4.jpg",
      "static/demo/q56/view_5.jpg",
      "static/demo/q56/view_6.jpg",
      "static/demo/q56/view_7.jpg",
      "static/demo/q56/view_8.jpg"
    ],
    "models": [
      {
        "name": "Gemini-3.5-flash",
        "views": [
          3,
          2,
          1
        ],
        "answer": "D",
        "correct": true
      },
      {
        "name": "GPT-5.2",
        "views": [
          3
        ],
        "answer": "B",
        "correct": false
      },
      {
        "name": "Qwen3-VL-8B-Instruct",
        "views": [
          3
        ],
        "answer": "B",
        "correct": false
      }
    ]
  }
];
