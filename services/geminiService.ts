
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateStudentReport(
  studentName: string, 
  level: string, 
  observations: string,
  studentPerformance: string,
  levelAverage: string
) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بصفتك مستشاراً تربوياً خبيراً لمدرسة ابتدائية، قم بكتابة تقرير أداء تحليلي وشامل باللغة العربية للطالب "${studentName}" في "${level}".

بيانات الأداء الحالية للطالب:
${studentPerformance}

متوسط أداء الطلاب في نفس المستوى (${level}):
${levelAverage}

ملاحظات المعلم الإضافية:
"${observations}"

المطلوب المن التقرير:
1. تحليل نقاط القوة والضعف للطالب مقارنة بمتوسط زملائه في الفصل.
2. تقديم تقييم موضوعي (هل هو متفوق، متوسط، أو يحتاج لدعم إضافي في مواد معينة).
3. تقديم 3 توصيات عميقة وعملية للوالدين و3 توصيات للمعلم لمساعدة الطالب على التطور بناءً على هذه المقارنة.
4. كتابة رسالة تشجيعية للطالب في نهاية التقرير.

اجعل التقرير مهنياً، تربوياً، ومحفزاً.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating AI report:", error);
    return "عذراً، حدث خطأ أثناء إنشاء التقرير. يرجى المحاولة لاحقاً.";
  }
}

export async function generateScheduleSuggestion() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "اقترح جدولاً دراسياً أسبوعياً نموذجياً لمستوى السنة الخامسة ابتدائي في الجزائر، مع مراعاة المواد الأساسية (عربية، رياضيات، فرنسية) والأنشطة اللاصفية.",
    });
    return response.text;
  } catch (error) {
    return "لا يمكن توليد الجدول حالياً.";
  }
}
