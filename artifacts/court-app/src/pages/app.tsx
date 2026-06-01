import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useGetMe, useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Copy, Trash2, CheckCircle2, FileText, Scale } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const templates = {
  j_accept: `[TABLE width="100%"]
[TR]
[td][CENTER][SIZE=4][FONT=trebuchet ms][IMG width="190px"]https://i.imgur.com/ivp7LDT.png[/IMG][/FONT][/SIZE][FONT=trebuchet ms]
[SIZE=5]СУД ШТАТА УИНСЛОУ[/SIZE][/FONT]
[SIZE=4][FONT=trebuchet ms]312-я Север-Спринг, Лос-Сантос
WS 90012, Соединенные Штаты[/FONT][/SIZE][FONT=trebuchet ms]

[SIZE=5]ОПРЕДЕЛЕНИЕ[/SIZE][/FONT][/CENTER]
[FONT=trebuchet ms][/FONT]
[LEFT][FONT=trebuchet ms][SIZE=4]Cуд, в лице судьи {judge_name}, в соответствии с разделом 6 Конституции, а также отраслевым законодательством о судебной системе, предварительно рассмотрев исковое заявление №{case_number} {plaintiff} против {defendant},[/SIZE][/FONT][/LEFT]
[CENTER][FONT=trebuchet ms]
[SIZE=5]УСТАНОВИЛ:[/SIZE][/FONT][/CENTER]
[FONT=trebuchet ms][/FONT]
[LEFT][FONT=trebuchet ms][SIZE=4]Суд отмечает, что сторона обвинения (Истец) обратилась с жалобой, указывая на следующие обстоятельства: {cause}
Истцом заявлены следующие требования: {claims}[/SIZE][/FONT][/LEFT]

[CENTER][FONT=trebuchet ms]
[SIZE=5]ОПРЕДЕЛИЛ:[/SIZE][/FONT][/CENTER]
[FONT=trebuchet ms][/FONT]
[LEFT][SIZE=4][FONT=trebuchet ms]1. Принять к производству исковое заявление [/FONT][/SIZE][FONT=trebuchet ms][SIZE=4]{case_number} {plaintiff} против {defendant}.[/SIZE][/FONT]
[SIZE=4][FONT=trebuchet ms]2. Потребовать у ответчика, гражданина {defendant}, исчерпывающий ответ, касающийся обстоятельств дела, в срок, установленный законом.
Данное определение не подлежит обжалованию.[/FONT][/SIZE][/LEFT]
[CENTER][/CENTER]

[RIGHT][FONT=trebuchet ms]{judge_name},
Суд Winslow[/FONT]
[SIZE=4][FONT=trebuchet ms][IMG width="130px"]https://i.imgur.com/dDLNKzS.png[/IMG][/FONT][/SIZE][/RIGHT][/td]
[/TR]
[/TABLE]`,

  j_reject: `[TABLE width="100%"]
[TR]
[td][CENTER][SIZE=4][FONT=trebuchet ms][IMG width="190px"]https://i.imgur.com/ivp7LDT.png[/IMG][/FONT][/SIZE][FONT=trebuchet ms]
[SIZE=5]СУД ШТАТА УИНСЛОУ[/SIZE][/FONT]
[SIZE=4][FONT=trebuchet ms]312-я Север-Спринг, Лос-Сантос
WS 90012, Соединенные Штаты[/FONT][/SIZE][FONT=trebuchet ms]

[SIZE=5]РЕШЕНИЕ[/SIZE][/FONT][/CENTER]
[FONT=trebuchet ms][/FONT]
[LEFT][FONT=trebuchet ms][SIZE=4]Суд, в лице судьи {judge_name}, в соответствии с разделом 6 Конституции, а также отраслевым законодательством о судебной системе, рассмотрев исковое заявление №{case_number},[/SIZE][/FONT][/LEFT]
[CENTER][FONT=trebuchet ms]
[SIZE=5]УСТАНОВИЛ:[/SIZE][/FONT][/CENTER]
[FONT=trebuchet ms][/FONT]
[LEFT][FONT=trebuchet ms][SIZE=4]Истец нарушил правила подачи исковых заявлений, из чего следует, что иск не может быть рассмотрен.

Суд даёт дословный комментарий о причинах отказа:
{reason}[/SIZE][/FONT][/LEFT]
[CENTER][FONT=trebuchet ms]
[SIZE=5]РЕШИЛ:[/SIZE][/FONT][/CENTER]
[FONT=trebuchet ms][/FONT]
[LEFT][SIZE=4][FONT=trebuchet ms]Оставить без удовлетворения исковые требования по делу №{case_number}[/FONT][/SIZE][FONT=trebuchet ms][SIZE=4]:[/SIZE][/FONT]

[SIZE=4][FONT=trebuchet ms]1. Отказать в возбуждении производства по делу №{case_number}.
2. Направить истцу рекомендацию об ознакомлении с правилами подачи иска.

Данное решение не подлежит обжалованию.
Решение вступает в законную силу с момента публикации.
Суд приказывает закрыть судебное производство по данному делу.[/FONT][/SIZE][/LEFT]
[CENTER][/CENTER]
[RIGHT][FONT=trebuchet ms]{judge_name},
Суд Winslow[/FONT]
[SIZE=4][FONT=trebuchet ms][IMG width="130px"]https://i.imgur.com/dDLNKzS.png[/IMG][/FONT][/SIZE][/RIGHT][/td]
[/TR]
[/TABLE]`,

  j_verdict: `[TABLE width="100%"]
[TR]
[td][CENTER][SIZE=4][FONT=trebuchet ms][IMG width="190px"]https://i.imgur.com/ivp7LDT.png[/IMG][/FONT][/SIZE][FONT=trebuchet ms]
[SIZE=5]СУД ШТАТА УИНСЛОУ[/SIZE][/FONT]
[SIZE=4][FONT=trebuchet ms]312-я Север-Спринг, Лос-Сантос
WS 90012, Соединенные Штаты[/FONT][/SIZE][FONT=trebuchet ms]
 
[SIZE=5]РЕШЕНИЕ[/SIZE][/FONT][/CENTER]
[FONT=trebuchet ms][/FONT]
[LEFT][FONT=trebuchet ms][SIZE=4]Суд, в лице судьи {judge_name}, в соответствии с разделом 6 Конституции, а также отраслевым законодательством о судебной системе, рассмотрев исковое заявление {case_number} {plaintiff} против {defendant},[/SIZE][/FONT][/LEFT]
[CENTER][FONT=trebuchet ms]
[SIZE=5]УСТАНОВИЛ:[/SIZE][/FONT][/CENTER]
[FONT=trebuchet ms][/FONT]
[LEFT][FONT=trebuchet ms][SIZE=4]Основанием для подачи иска стало следующее:
{cause}
 
Истец требует следующее:
{claims}

По итогам рассмотрения искового заявления были выслушаны позиции сторон обвинения и защиты.[/SIZE][/FONT][/LEFT]
[CENTER][FONT=trebuchet ms]
[SIZE=5]РЕШИЛ:[/SIZE][/FONT][/CENTER]
[FONT=trebuchet ms][/FONT]
[LEFT][SIZE=4][FONT=trebuchet ms]{v_type} требования по делу {case_number} {plaintiff} против {defendant}[/FONT][/SIZE][FONT=trebuchet ms][SIZE=4]:[/SIZE][/FONT]

[SIZE=4][FONT=trebuchet ms]{verdict}

Данное решение подлежит обжалованию в установленном законом порядке.
Решение вступает в законную силу с момента публикации.
Суд приказывает закрыть судебное производство по данному делу.[/FONT][/SIZE][/LEFT]
[CENTER][/CENTER]
[RIGHT][FONT=trebuchet ms]{judge_name},
Суд Winslow[/FONT]
[SIZE=4][FONT=trebuchet ms][IMG width="130px"]https://i.imgur.com/dDLNKzS.png[/IMG][/FONT][/SIZE][/RIGHT][/td]
[/TR]
[/TABLE]`,

  j_summons: `1. Ник судьи: {judge_name}
2. Ссылка на исковое заявление: {claim_url}
3. Срок на ответ: {answer_deadline}
4. Кому адресовано: {recipient}`,

  j_close: `1. Ссылка на исковое заявление: {claim_url}
2. Передать дело: {discord_role}`
};

export default function AppRoute() {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading, isError } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });
  const logoutMutation = useLogout();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("j_accept");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedText, setGeneratedText] = useState("");

  useEffect(() => {
    if ((!isLoading && !user) || isError) {
      setLocation("/");
    } else if (user && !user.approved) {
      setLocation("/");
    }
  }, [user, isLoading, isError, setLocation]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground font-serif tracking-widest uppercase">Загрузка системы...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => setLocation("/")
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    let text = templates[activeTab as keyof typeof templates];
    Object.entries(formData).forEach(([key, value]) => {
      text = text.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    setGeneratedText(text);
  };

  const handleClear = () => {
    setFormData({});
    setGeneratedText("");
  };

  const handleCopy = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
      toast({
        title: "Скопировано",
        description: "Текст успешно скопирован в буфер обмена.",
      });
    }
  };

  const renderField = (field: string, label: string, type: "text" | "textarea" | "select" = "text", options?: {label: string, value: string}[]) => (
    <div className="space-y-2" key={field}>
      <Label htmlFor={field} className="text-muted-foreground text-xs uppercase tracking-wider">{label}</Label>
      {type === "textarea" ? (
        <Textarea 
          id={field}
          value={formData[field] || ""}
          onChange={e => handleInputChange(field, e.target.value)}
          className="min-h-[100px] font-sans resize-y bg-background/50 border-border"
          required
        />
      ) : type === "select" ? (
        <Select value={formData[field] || ""} onValueChange={v => handleInputChange(field, v)} required>
          <SelectTrigger className="bg-background/50 border-border">
            <SelectValue placeholder="Выберите значение" />
          </SelectTrigger>
          <SelectContent>
            {options?.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input 
          id={field}
          value={formData[field] || ""}
          onChange={e => handleInputChange(field, e.target.value)}
          className="bg-background/50 border-border font-sans"
          required
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-card/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-primary" />
            <h1 className="font-serif text-lg font-medium text-primary tracking-wider uppercase hidden sm:block">
              Судебная коллегия Winslow
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="bg-muted text-primary font-serif">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground hidden md:block">{user.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-border text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setGeneratedText(""); setFormData({}); }} className="flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-64 shrink-0">
            <div className="mb-4 text-xs font-serif text-primary/70 uppercase tracking-widest px-2">Тип документа</div>
            <TabsList className="flex flex-col h-auto bg-transparent gap-1 p-0">
              <TabsTrigger value="j_accept" className="w-full justify-start px-4 py-3 text-left font-serif tracking-wide border border-transparent data-[state=active]:bg-card data-[state=active]:border-border/50 data-[state=active]:text-primary rounded-none">
                Принятие
              </TabsTrigger>
              <TabsTrigger value="j_reject" className="w-full justify-start px-4 py-3 text-left font-serif tracking-wide border border-transparent data-[state=active]:bg-card data-[state=active]:border-border/50 data-[state=active]:text-primary rounded-none">
                Отказ
              </TabsTrigger>
              <TabsTrigger value="j_verdict" className="w-full justify-start px-4 py-3 text-left font-serif tracking-wide border border-transparent data-[state=active]:bg-card data-[state=active]:border-border/50 data-[state=active]:text-primary rounded-none">
                Вердикт
              </TabsTrigger>
              <TabsTrigger value="j_summons" className="w-full justify-start px-4 py-3 text-left font-serif tracking-wide border border-transparent data-[state=active]:bg-card data-[state=active]:border-border/50 data-[state=active]:text-primary rounded-none">
                Передача повесток
              </TabsTrigger>
              <TabsTrigger value="j_close" className="w-full justify-start px-4 py-3 text-left font-serif tracking-wide border border-transparent data-[state=active]:bg-card data-[state=active]:border-border/50 data-[state=active]:text-primary rounded-none">
                Закрытие / передача
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 min-w-0 flex flex-col xl:flex-row gap-8">
            <Card className="flex-1 border-border/50 bg-card shadow-lg rounded-none">
              <CardContent className="p-6">
                <form onSubmit={handleGenerate} className="space-y-6">
                  {activeTab === "j_accept" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField("judge_name", "Имя судьи")}
                        {renderField("case_number", "Номер иска (.../threads/xxxx)")}
                        {renderField("plaintiff", "Истец")}
                        {renderField("defendant", "Ответчик")}
                      </div>
                      {renderField("cause", "Обстоятельства (Основание)", "textarea")}
                      {renderField("claims", "Требования истца", "textarea")}
                    </>
                  )}
                  
                  {activeTab === "j_reject" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField("judge_name", "Имя судьи")}
                        {renderField("case_number", "Номер иска")}
                      </div>
                      {renderField("reason", "Причина отказа", "textarea")}
                    </>
                  )}

                  {activeTab === "j_verdict" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField("judge_name", "Имя судьи")}
                        {renderField("case_number", "Номер иска")}
                        {renderField("plaintiff", "Истец")}
                        {renderField("defendant", "Ответчик")}
                      </div>
                      {renderField("v_type", "Тип вердикта", "select", [
                        { label: "Удовлетворить", value: "Удовлетворить" },
                        { label: "Частично удовлетворить", value: "Частично удовлетворить" },
                        { label: "Оставить без удовлетворения", value: "Оставить без удовлетворения" },
                      ])}
                      {renderField("cause", "Основание иска", "textarea")}
                      {renderField("claims", "Требования истца", "textarea")}
                      {renderField("verdict", "Вердикт (Решение суда)", "textarea")}
                    </>
                  )}

                  {activeTab === "j_summons" && (
                    <>
                      {renderField("judge_name", "Имя судьи")}
                      {renderField("claim_url", "Ссылка на исковое заявление")}
                      {renderField("answer_deadline", "Срок на ответ")}
                      {renderField("recipient", "Кому адресовано")}
                    </>
                  )}

                  {activeTab === "j_close" && (
                    <>
                      {renderField("claim_url", "Ссылка на исковое заявление")}
                      {renderField("discord_role", "Кому передать", "select", [
                        { label: "Сенат", value: "<@&893036813445378109>" },
                        { label: "Окружной прокурор", value: "<@&982268204481134602>" },
                      ])}
                    </>
                  )}

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50">
                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-serif tracking-wider uppercase rounded-none px-8">
                      <FileText className="w-4 h-4 mr-2" /> Сгенерировать
                    </Button>
                    <Button type="button" variant="outline" onClick={handleClear} className="border-border text-muted-foreground hover:text-foreground rounded-none px-8">
                      <Trash2 className="w-4 h-4 mr-2" /> Очистить
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="flex-1 xl:max-w-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-serif tracking-widest uppercase text-muted-foreground">Результат</h3>
                <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!generatedText} className="text-primary hover:text-primary hover:bg-primary/10">
                  <Copy className="w-4 h-4 mr-2" /> Копировать
                </Button>
              </div>
              <Textarea 
                readOnly 
                value={generatedText}
                className="flex-1 min-h-[400px] font-mono text-sm resize-none bg-black/40 border-border/50 text-muted-foreground focus-visible:ring-0 focus-visible:border-primary/50 p-4 rounded-none"
                placeholder="Здесь появится сгенерированный текст..."
              />
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
