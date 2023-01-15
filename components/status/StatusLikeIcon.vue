<script setup lang="ts">
defineProps({
  checked: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
  },
})
</script>

<template>
  <div :class="checked ? 'checked' : ''" class="like-button">
    <label for="checkbox">
      <svg class="svg" :style="{ height: width, width }" v-bind="$attrs" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fill-rule="evenodd" transform="translate(467 392)">
          <path
            class="heart"
            d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z"
            fill="currentColor"
          />
          <circle class="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5" />

          <g class="grp7" opacity="0" transform="translate(7 6)">
            <circle class="oval1" fill="#9CD8C3" cx="2" cy="6" r="2" />
            <circle class="oval2" fill="#8CE8C3" cx="5" cy="2" r="2" />
          </g>

          <g class="grp6" opacity="0" transform="translate(0 28)">
            <circle class="oval1" fill="#CC8EF5" cx="2" cy="7" r="2" />
            <circle class="oval2" fill="#91D2FA" cx="3" cy="2" r="2" />
          </g>

          <g class="grp3" opacity="0" transform="translate(52 28)">
            <circle class="oval2" fill="#9CD8C3" cx="2" cy="7" r="2" />
            <circle class="oval1" fill="#8CE8C3" cx="4" cy="2" r="2" />
          </g>

          <g class="grp2" opacity="0" transform="translate(44 6)">
            <circle class="oval2" fill="#CC8EF5" cx="5" cy="6" r="2" />
            <circle class="oval1" fill="#CC8EF5" cx="2" cy="2" r="2" />
          </g>

          <g class="grp5" opacity="0" transform="translate(14 50)">
            <circle class="oval1" fill="#91D2FA" cx="6" cy="5" r="2" />
            <circle class="oval2" fill="#91D2FA" cx="2" cy="2" r="2" />
          </g>

          <g class="grp4" opacity="0" transform="translate(35 50)">
            <circle class="oval1" fill="#F48EA7" cx="6" cy="5" r="2" />
            <circle class="oval2" fill="#F48EA7" cx="2" cy="2" r="2" />
          </g>

          <g class="grp1" opacity="0" transform="translate(24)">
            <circle class="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2" />
            <circle class="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2" />
          </g>
        </g>
      </svg>
    </label>
  </div>
</template>

<style scoped lang="postcss">
.like-button {
  display: inline-block;

  .svg {
    cursor: pointer;
    overflow: visible;

    .heart {
      transform-origin: center;
      animation: animateHeartOut 0.3s linear forwards;
    }

    .main-circ {
      transform-origin: 29.5px 29.5px;
    }

  }
}

.like-button.checked {

  .heart {
    transform: scale(0.2);
    fill: #e2264d;

    animation: animateHeart 0.3s linear forwards 0.25s;
    height: 60px;
    width: 60px;
  }

  .main-circ {
    transition: all 2s;
    opacity: 1;
    animation: animateCircle 0.3s linear forwards;

  }

  .grp1 {
    opacity: 1;
    transition: 0.1s all 0.3s;

    .oval1 {
      transform: scale(0) translate(0, -30px);
      transform-origin: 0 0 0;
      transition: 0.5s transform 0.3s;
    }

    .oval2 {
      transform: scale(0) translate(10px, -50px);
      transform-origin: 0 0 0;
      transition: 1.5s transform 0.3s;
    }
  }

  .grp2 {
    opacity: 1;
    transition: 0.1s all 0.3s;

    .oval1 {
      transform: scale(0) translate(30px, -15px);
      transform-origin: 0 0 0;
      transition: 0.5s transform 0.3s;
    }

    .oval2 {
      transform: scale(0) translate(60px, -15px);
      transform-origin: 0 0 0;
      transition: 1.5s transform 0.3s;
    }
  }

  .grp3 {
    opacity: 1;
    transition: 0.1s all 0.3s;

    .oval1 {
      transform: scale(0) translate(30px, 0);
      transform-origin: 0 0 0;
      transition: 0.5s transform 0.3s;
    }

    .oval2 {
      transform: scale(0) translate(60px, 10px);
      transform-origin: 0 0 0;
      transition: 1.5s transform 0.3s;
    }
  }

  .grp4 {
    opacity: 1;
    transition: 0.1s all 0.3s;

    .oval1 {
      transform: scale(0) translate(30px, 15px);
      transform-origin: 0 0 0;
      transition: 0.5s transform 0.3s;
    }

    .oval2 {
      transform: scale(0) translate(40px, 50px);
      transform-origin: 0 0 0;
      transition: 1.5s transform 0.3s;
    }
  }

  .grp5 {
    opacity: 1;
    transition: 0.1s all 0.3s;

    .oval1 {
      transform: scale(0) translate(-10px, 20px);
      transform-origin: 0 0 0;
      transition: 0.5s transform 0.3s;
    }

    .oval2 {
      transform: scale(0) translate(-60px, 30px);
      transform-origin: 0 0 0;
      transition: 1.5s transform 0.3s;
    }
  }

  .grp6 {
    opacity: 1;
    transition: 0.1s all 0.3s;

    .oval1 {
      transform: scale(0) translate(-30px, 0);
      transform-origin: 0 0 0;
      transition: 0.5s transform 0.3s;
    }

    .oval2 {
      transform: scale(0) translate(-60px, -5px);
      transform-origin: 0 0 0;
      transition: 1.5s transform 0.3s;
    }
  }

  .grp7 {
    opacity: 1;
    transition: 0.1s all 0.3s;

    .oval1 {
      transform: scale(0) translate(-30px, -15px);
      transform-origin: 0 0 0;
      transition: 0.5s transform 0.3s;
    }

    .oval2 {
      transform: scale(0) translate(-55px, -30px);
      transform-origin: 0 0 0;
      transition: 1.5s transform 0.3s;
    }
  }

  .grp2 {
    opacity: 1;
    transition: 0.1s opacity 0.3s;
  }

  .grp3 {
    opacity: 1;
    transition: 0.1s opacity 0.3s;
  }

  .grp4 {
    opacity: 1;
    transition: 0.1s opacity 0.3s;
  }

  .grp5 {
    opacity: 1;
    transition: 0.1s opacity 0.3s;
  }

  .grp6 {
    opacity: 1;
    transition: 0.1s opacity 0.3s;
  }

  .grp7 {
    opacity: 1;
    transition: 0.1s opacity 0.3s;
  }

}

@keyframes animateHeart {
  0% {
    transform: scale(0.2);
  }

  40% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes animateHeartOut {
  0% {
    transform: scale(1.4);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes animateCircle {
  40% {
    transform: scale(10);
    opacity: 1;
    fill: #dd4688;
  }

  55% {
    transform: scale(11);
    opacity: 1;
    fill: #d46abf;
  }

  65% {
    transform: scale(12);
    opacity: 1;
    fill: #cc8ef5;
  }

  75% {
    transform: scale(13);
    opacity: 1;
    fill: transparent;
    stroke: #cc8ef5;
    stroke-width: 0.5;
  }

  85% {
    transform: scale(17);
    opacity: 1;
    fill: transparent;
    stroke: #cc8ef5;
    stroke-width: 0.2;
  }

  95% {
    transform: scale(18);
    opacity: 1;
    fill: transparent;
    stroke: #cc8ef5;
    stroke-width: 0.1;
  }

  100% {
    transform: scale(19);
    opacity: 1;
    fill: transparent;
    stroke: #cc8ef5;
    stroke-width: 0;
  }
}
</style>
