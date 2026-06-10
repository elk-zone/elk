<template>
  <section
    mt-4 mx-1 p5
    rounded-3
    bg-card
    flex="~ col" gap-4
  >
    <NavOmediaIcon style="width: 48px; height: 48px" />
    <div>
      <h2 text-lg font-bold>
        Welcome to Omedia
      </h2>
      <p text-sm text-secondary mt-1 leading-snug>
        Our internal social space. Sign in to follow colleagues, share updates, and join the conversation.
      </p>
    </div>
    <div mt-2>
      <UserSignInEntry />
    </div>
  </section>
</template>
