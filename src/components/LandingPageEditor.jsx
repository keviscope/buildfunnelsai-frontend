import { useState } from "react";
import Button from "./Button";

export default function LandingPageEditor({

    landingPage,

    onSave,

    onCancel

}) {

    const [headline, setHeadline] =
        useState(landingPage.headline);

    const [subheadline, setSubheadline] =
        useState(landingPage.subheadline);

    const [benefits, setBenefits] =
        useState([...landingPage.benefits]);

    const [cta, setCta] =
        useState(landingPage.cta);

    return (
        <div>
<div>

<h3>Headline</h3>

<textarea
    value={headline}
    onChange={(e)=>setHeadline(e.target.value)}
/>

</div>
<div>

<h3>Subheadline</h3>

<textarea
    value={subheadline}
    onChange={(e)=>setSubheadline(e.target.value)}
/>

</div>

<div>

<h3>CTA</h3>

<textarea
    value={cta}
    onChange={(e)=>setCta(e.target.value)}
/>

</div>


<h3>Benefits</h3>

{
benefits.map((benefit,index)=>(

<div key={index}>

<h4>

Benefit {index + 1}

</h4>

<textarea
rows={3}
style={{ width: "100%" }}

value={benefit}

onChange={(event)=>{

const updated=[...benefits];

updated[index]=event.target.value;

setBenefits(updated);

}}

/>

</div>

))
}


<Button text="Save" onClick={()=>{
    onSave({ headline, subheadline, benefits, cta });
}}/>

<Button
    text="Cancel"
    onClick={onCancel}
/>
        </div>
    );
}