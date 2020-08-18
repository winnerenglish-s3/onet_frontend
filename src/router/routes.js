const routes = [{
    path: "/",
    component: () => import("pages/login.vue"),
    name: "login"
  },
  {
    path: "/welcomeback",
    component: () => import("pages/welcomeback.vue"),
    name: "welcomeback"
  },
  {
    path: "/answersheet",
    component: () => import("pages/answersheet.vue")
  },
  {
    path: "/question",
    component: () => import("pages/question.vue")
  },
  {
    path: "/order",
    component: () => import("pages/order.vue")
  },
  {
    path: "/studentpractice",
    component: () => import("pages/studentpratice.vue")
  },
  {
    path: "/classroomanswer",
    component: () => import("pages/kahootanswer.vue")
  },
  {
    path: "/teacherMenuSelection",
    component: () => import("pages/teacher/teachermenuselection.vue"),
    name: "teacherMenuSelection"
  },
  {
    path: "/teacherStudyplan",
    component: () => import("pages/teacher/teacherStudyplan.vue"),
    name: "teacherStudyplan"
  },
  {
    path: "/teacherCountdown/:practicekey",
    component: () => import("pages/teacher/teacherCountdown.vue"),
    name: "teacherCountdown"
  },
  {
    path: "/teacherShowAnswer/:key",
    component: () => import("pages/teacher/showAnswer.vue"),
    name: "teacherShowAnswer"
  },
  {
    path: "/teacherEditInfo",
    component: () => import("pages/teacher/editTeacherInfo.vue"),
    name: "teacherEditInfo"
  },
  {
    path: "/summaryTable/:key",
    component: () => import("pages/teacher/summaryTable.vue"),
    name: "summaryTable"
  },
  {
    path: "/vdoteaching/:key",
    component: () => import("pages/teacher/vdoteaching.vue"),
    name: "vdoteaching"
  },
  {
    path: "/teacherPractice/:key",
    component: () => import("pages/teacher/teacherKahoot.vue"),
    name: "teacherKahoot"
  }, {
    // type 1 = แบบทดสอบ
    // type 2 = ข้อสอบ
    path: "/preparing/:key/:type",
    component: () => import("pages/teacher/preparing.vue"),
    name: "preparing"
  },
  {
    path: "/teacherTest/:key",
    component: () => import("pages/teacher/teacherTest.vue"),
    name: "teacherTest"
  },
  {
    path: "/teacherRanking/",
    component: () => import("pages/teacher/teacherRanking.vue"),
    name: "teacherRanking"
  },
  {
    path: "/rankingtop3/",
    component: () => import("pages/teacher/rankingtop3.vue"),
    name: "rankingtop3"
  },
  {
    path: "/teacherScore/",
    component: () => import("pages/teacher/teacherScore.vue"),
    name: "teacherScore"
  },
  {
    path: "/teacherTestAnswer/:key",
    component: () => import("pages/teacher/teacherTestAnswer.vue"),
    name: "teacherTestAnswer"
  },
  {
    path: "/printScore",
    component: () => import("pages/teacher/printScore.vue"),
    name: "printScore"
  },
  {
    path: "/teacherHomeworkScore",
    component: () => import("pages/teacher/teacherHomeworkScore.vue"),
    name: "teacherHomeworkScore"
  },
  // teacherReviewScore
  {
    path: "/teacherReviewScore",
    component: () => import("pages/teacher/teacherReviewScore.vue"),
    name: "teacherReviewScore"
  },
  // student
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      // NOTE รอสักครู่
      {
        path: "/student/waiting/",
        component: () => import("pages/student/waiting.vue"),
        name: "studentWaiting"
      },
      // NOTE รอเพื่อน
      {
        path: "/student/waiting/friend/",
        component: () => import("pages/student/waitFriend.vue"),
        name: "studentWaitingFriend"
      },
      // NOTE คาบเรียน
      {
        path: "/student/waiting/section/",
        component: () => import("pages/student/waitSection.vue"),
        name: "studentWaitingSection"
      },
      // NOTE โชว์คะแนน
      {
        path: "/student/score/",
        component: () => import("pages/student/score.vue"),
        name: "studentScore"
      },
      // NOTE กระดาษคำตอบ
      {
        path: "/student/answersheet/",
        component: () => import("pages/student/answerSheet.vue"),
        name: "studentAnswerSheet"
      },
      // NOTE เฉลยการบ้าน
      {
        path: "/student/answer/",
        component: () => import("pages/student/answer.vue"),
        name: "studentAnswer"
      },
      // NOTE วีดีโอการสอน
      {
        path: "/student/vdo/",
        component: () => import("pages/student/vdo.vue"),
        name: "studentVideo"
      },
      // NOTE แบบฝึกหัด
      {
        path: "/student/practice/",
        component: () => import("pages/student/kahoot.vue"),
        name: "studentPracticeKahoot"
      },
      // NOTE แบบทดสอบ
      {
        path: "/student/test/",
        component: () => import("pages/student/test.vue"),
        name: "studentTest"
      },
      // NOTE ตารางคะแนน
      {
        path: "/student/report/",
        component: () => import("pages/student/reportScore.vue"),
        name: "studentReportScore"
      },
      // NOTE ข้อสอบ
      {
        path: "/student/exam/",
        component: () => import("pages/student/exam.vue"),
        name: "studentExam"
      },
      // NOTE เฉลยข้อสอบ
      {
        path: "/student/examanswer/",
        component: () => import("pages/student/examanswer.vue"),
        name: "studentExamAnswer"
      }

    ],
  },

];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
